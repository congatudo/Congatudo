const BasicControlCapability = require("../../../core/capabilities/BasicControlCapability");
const Logger = require("../../../Logger");
const StatusStateAttribute = require("../../../entities/state/attributes/StatusStateAttribute");
const {sleep} = require("../../../utils/misc");

/**
 * @extends BasicControlCapability<import("../CecotecCongaRobot")>
 */
module.exports = class CecotecBasicControlCapability extends BasicControlCapability {
    async start() {
        await this.startWithTransientTimeoutRecovery();
    }

    async stop() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.stop();
    }

    async pause() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.pause();
    }

    async home() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.home();
    }

    async startWithTransientTimeoutRecovery() {
        try {
            await this.startRobot();
        } catch (e) {
            if (!this.isAutoCleanResponseTimeout(e)) {
                throw e;
            }

            if (await this.startLikelySucceeded()) {
                Logger.warn("Start command timed out waiting for response, but robot state indicates cleaning has started.");
                return;
            }

            throw e;
        }
    }

    async startRobot() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.start();
    }

    /**
     * @param {any} err
     * @returns {boolean}
     */
    isAutoCleanResponseTimeout(err) {
        return (
            typeof err?.message === "string" &&
            err.message.includes("Timeout waiting for response from opcode 'DEVICE_AUTO_CLEAN_RSP'")
        );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async startLikelySucceeded() {
        await sleep(1000);

        const status = this.robot.state.getFirstMatchingAttributeByConstructor(StatusStateAttribute);

        return Boolean(status?.isActiveState);
    }
};
