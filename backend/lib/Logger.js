const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const os = require("os");
const path = require("node:path");
const Tools = require("./utils/Tools");
const util = require("util");

class Logger {
    constructor() {
        this._logEventEmitter = new EventEmitter();
        this._logFileMaxSizeCheckLineCounter = 1;
        this._currentLogFileSize = 0;


        this.logFileMaxSize = 4 * 1024 * 1024; //4MiB
        this.logFileMaxArchivedFiles = Logger.DEFAULT_MAX_ARCHIVED_LOGFILES;
        this.logFileMaxArchivedFileAgeMs = Logger.DEFAULT_MAX_ARCHIVED_LOGFILE_AGE_MS;
        this.logLevel = Logger.LogLevels["info"];

        this.logFilePath = os.type() === "Windows_NT" ? Logger.DEFAULT_LOGFILE_PATHS.WINNT : Logger.DEFAULT_LOGFILE_PATHS.POSIX;
        this.logFileWriteStream = this.createLogFileWriteStream(this.logFilePath);
    }

    /**
     * @public
     * @return {string}
     */
    getLogLevel() {
        return Object.keys(Logger.LogLevels).find(key => {
            return Logger.LogLevels[key] === this.logLevel;
        });
    }

    /**
     * @public
     * @param {string} value
     */
    setLogLevel(value) {
        if (Logger.LogLevels[value] === undefined) {
            throw new Error(`Invalid log level '${value}', valid are '${Object.keys(Logger.LogLevels).join("','")}'`);
        } else {
            this.logLevel = Logger.LogLevels[value];
        }
    }

    /**
     * @public
     * @return {string}
     */
    getLogFilePath() {
        return this.logFilePath;
    }

    /**
     * @public
     * @param {string} filePath
     */
    setLogFilePath(filePath) {
        if (Tools.ARE_SAME_FILES(this.logFilePath, filePath)) {
            // We are already writing to that file
            return;
        }

        if (this.logFileWriteStream) {
            this.logFileWriteStream.close();
            this.logFileWriteStream = null;
        }

        this.logFilePath = filePath;
        const isLoggingToStdout = Tools.ARE_SAME_FILES(filePath, "/proc/self/fd/1");

        // Check if output is already redirected to that same file. If
        // it is, we do not need to write to that same file, because that
        // would lead to duplicate log entries.
        // Setting the LogFilename anyway ensures that the UI Log still works.
        if (isLoggingToStdout) {
            this._currentLogFileSize = 0;
        } else {
            this.logFileWriteStream = this.createLogFileWriteStream(this.logFilePath);
        }

        this.log("info", "Set Logfile to " + filePath);
    }


    /**
     * @private
     * @param {string} logLevel
     * @return {string}
     */
    buildLogLinePrefix(logLevel) {
        return `[${new Date().toISOString()}] [${logLevel}]`;
    }

    /**
     * @private
     * @param {string} message
     * @param {any} [error]
     */
    logInternalWarning(message, error) {
        const callbackArgs = [this.buildLogLinePrefix("WARN"), message];

        if (arguments.length > 1) {
            callbackArgs.push(error);
        }

        Logger.LogLevels.warn.callback(...callbackArgs);
    }

    /**
     * @private
     * @param {string} filePath
     * @returns {fs.WriteStream}
     */
    createLogFileWriteStream(filePath) {
        /*
            fs.createWriteStream may open asynchronously.
            Touching the file synchronously avoids transient ENOENTs during immediate size checks.
         */
        fs.closeSync(fs.openSync(filePath, "a"));
        this._currentLogFileSize = fs.statSync(filePath).size;

        return fs.createWriteStream(filePath, Logger.LogFileOptions);
    }

    /**
     * @private
     * @param {string} [pathToCheck]
     * @returns {boolean}
     */
    shouldManageLogFile(pathToCheck = this.logFilePath) {
        return (
            pathToCheck !== Logger.DEFAULT_LOGFILE_PATHS.WINNT &&
            pathToCheck !== Logger.DEFAULT_LOGFILE_PATHS.POSIX
        );
    }

    /**
     * @private
     * @returns {string}
     */
    getRotatedLogFilePath() {
        const timestamp = new Date().toISOString()
            .split("-").join("")
            .split(":").join("")
            .split(".").join("");
        let candidatePath = `${this.logFilePath}.${timestamp}`;
        let collisionCounter = 1;

        while (fs.existsSync(candidatePath)) {
            candidatePath = `${this.logFilePath}.${timestamp}.${collisionCounter}`;
            collisionCounter++;
        }

        return candidatePath;
    }

    /**
     * @private
     * @returns {Array<{path: string, mtimeMs: number}>}
     */
    getArchivedLogFiles() {
        const directoryPath = path.dirname(this.logFilePath);
        const logFilename = path.basename(this.logFilePath);
        const prefix = `${logFilename}.`;

        try {
            return fs.readdirSync(directoryPath, {withFileTypes: true})
                .filter(dirent => {
                    return dirent.isFile() && dirent.name.startsWith(prefix);
                })
                .map(dirent => {
                    const absolutePath = path.join(directoryPath, dirent.name);
                    const stats = fs.statSync(absolutePath);

                    return {
                        path: absolutePath,
                        mtimeMs: stats.mtimeMs
                    };
                })
                .sort((a, b) => {
                    return b.mtimeMs - a.mtimeMs;
                });
        } catch (e) {
            this.logInternalWarning("Failed to enumerate archived logfiles.", e);

            return [];
        }
    }

    /**
     * @private
     * @returns {Array<string>}
     */
    cleanupArchivedLogs() {
        const now = Date.now();
        const archivedLogFiles = this.getArchivedLogFiles();
        const filesToDelete = archivedLogFiles
            .filter((archivedLogFile, index) => {
                const exceedsConfiguredCount = index >= this.logFileMaxArchivedFiles;
                const exceedsConfiguredAge = now - archivedLogFile.mtimeMs > this.logFileMaxArchivedFileAgeMs;

                return exceedsConfiguredCount || exceedsConfiguredAge;
            })
            .map(archivedLogFile => {
                return archivedLogFile.path;
            });
        let failedDeletions = 0;

        filesToDelete.forEach(filePath => {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                failedDeletions++;
                this.logInternalWarning(`Failed to delete archived logfile '${filePath}'.`, e);
            }
        });

        if (failedDeletions > 0) {
            this.logInternalWarning(`Failed to delete ${failedDeletions} archived logfile(s).`);
        }

        return filesToDelete;
    }

    /**
     * @private
     * @param {number} fileSize
     */
    rotateLogFile(fileSize) {
        const rotatedLogFilePath = this.getRotatedLogFilePath();

        try {
            this.logFileWriteStream.close();
            this.logFileWriteStream = null;

            fs.renameSync(this.logFilePath, rotatedLogFilePath);
            this.logFileWriteStream = this.createLogFileWriteStream(this.logFilePath);

            const deletedArchivedLogFiles = this.cleanupArchivedLogs();

            this.warn(`Logfile ${this.logFilePath} was rotated after reaching ${fileSize} bytes.`);

            if (deletedArchivedLogFiles.length > 0) {
                this.info(`Deleted ${deletedArchivedLogFiles.length} archived logfile(s).`);
            }
        } catch (e) {
            this.logInternalWarning("Failed to rotate logfile. Falling back to truncation.", e);

            try {
                fs.writeFileSync(this.logFilePath, "");
            } catch (writeError) {
                this.logInternalWarning("Failed to truncate logfile during rotation fallback.", writeError);
            }

            this.logFileWriteStream = this.createLogFileWriteStream(this.logFilePath);
            this.warn(`Logfile ${this.logFilePath} was truncated after reaching a size of ${fileSize} bytes.`);
        }
    }

    /**
     * @param {string} level
     * @param {...any} args
     * @private
     */
    log(level, ...args) {
        if (this.logLevel["level"] <= Logger.LogLevels[level]["level"]) {
            const logLinePrefix = this.buildLogLinePrefix(level.toUpperCase());
            const logLine = [logLinePrefix, ...args].map(arg => {
                if (typeof arg === "string") {
                    return arg;
                }

                return util.inspect(
                    arg,
                    {
                        depth: Infinity
                    }
                );
            }).join(" ");

            Logger.LogLevels[level]["callback"](logLine);
            this.logLineToFile(logLine);
            this._logEventEmitter.emit("LogMessage", logLine);
        }
    }

    /**
     * @private
     * @param {string} line
     */
    logLineToFile(line) {
        if (this.logFileWriteStream) {
            /*
                As the default limit is rather large, we can avoid checking the logfile size on every single
                log line without running into any OOM issues
             */
            this._logFileMaxSizeCheckLineCounter = (this._logFileMaxSizeCheckLineCounter + 1) % 100;

            if (this._logFileMaxSizeCheckLineCounter === 0) {
                if (this.shouldManageLogFile() === true) {
                    if (this._currentLogFileSize > this.logFileMaxSize) {
                        this.rotateLogFile(this._currentLogFileSize);
                    }
                }
            }


            const writtenLine = `${line}\n`;

            this.logFileWriteStream.write(line);
            this.logFileWriteStream.write("\n");
            this._currentLogFileSize += Buffer.byteLength(writtenLine, "utf-8");
        }
    }

    /**
     * @public
     * @param {any} listener
     */
    onLogMessage(listener) {
        this._logEventEmitter.on("LogMessage", listener);
    }

    /**
     * @public
     * @see console.trace
     * @param  {...any} args
     */
    trace(...args) {
        this.log("trace", ...args);
    }

    /**
     * @public
     * @see console.debug
     * @param  {...any} args
     */
    debug(...args) {
        this.log("debug", ...args);
    }

    /**
     * @public
     * @see console.info
     * @param  {...any} args
     */
    info(...args) {
        this.log("info", ...args);
    }

    /**
     * @public
     * @see console.warn
     * @param  {...any} args
     */
    warn(...args) {
        this.log("warn", ...args);
    }

    /**
     * @public
     * @see console.error
     * @param  {...any} args
     */
    error( ...args) {
        this.log("error", ...args);
    }

    /**
     * @public
     */
    getProperties() {
        return {
            EVENTS: Logger.EVENTS,
            LogLevels: Logger.LogLevels
        };
    }
}

Logger.EVENTS = {
    LogMessage: "LogMessage",
};

Logger.LogLevels = Object.freeze({
    // eslint-disable-next-line no-console
    "trace": {"level": -2, "callback": console.debug},
    // eslint-disable-next-line no-console
    "debug": {"level": -1, "callback": console.debug},
    // eslint-disable-next-line no-console
    "info": {"level": 0, "callback": console.info},
    // eslint-disable-next-line no-console
    "warn": {"level": 1, "callback": console.warn},
    // eslint-disable-next-line no-console
    "error": {"level": 2, "callback": console.error},
});

Logger.LogFileOptions = Object.freeze({
    flags: "as"
});

Logger.DEFAULT_MAX_ARCHIVED_LOGFILES = 5;
Logger.DEFAULT_MAX_ARCHIVED_LOGFILE_AGE_MS = 7 * 24 * 60 * 60 * 1000; //7 days

Logger.DEFAULT_LOGFILE_PATHS = Object.freeze({
    POSIX: "/dev/null",
    WINNT: "\\\\.\\NUL"
});


module.exports = new Logger();
