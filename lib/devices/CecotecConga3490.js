/* eslint-disable max-classes-per-file */
/* globals BigInt */
const net = require("net");
const binary = require("binary");
const protobuf = require("protobufjs");
const root = protobuf.Root.fromJSON(require("../../schema.json"));
const Logger = require("../Logger");
const entities = require("../entities");
const { EventEmitter } = require("events");

const { RobotState, attributes: { BatteryStateAttribute, StatusStateAttribute, FanSpeedStateAttribute, LatestCleanupStatisticsAttribute } } = entities.state;
const BATTERY_FLAG = BatteryStateAttribute.FLAG;
const STATUS_STATE_FLAG = StatusStateAttribute.FLAG;
const STATUS_STATE_VALUE = StatusStateAttribute.VALUE;
const FAN_SPEED_STATE_VALUE = FanSpeedStateAttribute.VALUE;
const LATEST_CLEANUP_STATISTICS_TYPE = LatestCleanupStatisticsAttribute.TYPE;
const BATTERY_MAX = 200;

const OPCODES = {
    // "SMSG_ERROR": 0x0001,
    // "SMSG_DISCONNECT": 0x0002,
    // "CMSG_USER_LOGIN": 0x0BB9,
    // "SMSG_USER_LOGIN": 0x0BBA,
    "QMSG_DEVICE_LOGIN": 0x07D1,
    "RMSG_DEVICE_LOGIN": 0x07D2,
    "QMSG_PING": 0x07D5,
    "RMSG_PING": 0x07D6,
    // "CMSG_USER_LOGOUT": 0x0BBB,
    // "SMSG_USER_LOGOUT": 0x0BBC,
    // "CMSG_DEVICE_LIST": 0x0BCB,
    // "SMSG_DEVICE_LIST": 0x0BCC,
    // "SMSG_USER_KICK": 0x0C12,
    // "CMSG_DEVICE_TIME": 0x1011,
    // "SMSG_DEVICE_TIME": 0x1012,
    // "CMSG_PING": 0x1079,
    // "SMSG_PING": 0x107A,
    // "CMSG_DISCONNECT_DEVICE": 0x107B,
    // "SMSG_DISCONNECT_DEVICE": 0x107C,
    // "CMSG_TASK_DATA": 0x10CD,
    // "SMSG_TASK_DATA": 0x10CE,
    "QMSG_CONNECT_DEVICE": 0x1009,
    "QMSG_DEVICE_STATUS": 0x10FE,
    "QMSG_LOCATE_DEVICE": 0X10EB,
    "RMSG_LOCATE_DEVICE": 0X10EC,
    // "CMSG_CTRL_TYPE": 0x110b,
    // "SMSG_CTRL_TYPE": 0x110c,
    // "CMSG_SET_CLEAN_MODE": 0x1121,
    // "CMSG_MAP_INFO": 0x1162,
    // "SMSG_MAP_INFO": 0x1163,
    // "SMSG_UPDATE_ROBOT_POSITION": 0x1166,
    // "SMSG_UPDATE_CHARGE_POSITION": 0x1168,
    // "SMSG_DEVICE_BUSY": 0x1169,
    // "SMSG_AREA_LIST_INFO": 0x116A,
    "QMSG_DEVICE_VERSION": 0x119C,
    "RMSG_DEVICE_VERSION": 0x119D,
    // "CMSG_CLEAN_RECORDS": 0x1389,
    // "SMSG_CLEAN_RECORDS": 0x138a,
    "QMSG_DEVICE_OTA": 0x1461,
    "RMSG_DEVICE_OTA": 0x1462,
    // "CMSG_DEVICE_INFO": 0x1463,
    // "SMSG_DEVICE_INFO": 0x1464,
    "QMSG_BATTERY_LEVEL": 0x146f,
    "RMSG_BATTERY_LEVEL": 0x1470,
    // "CMSG_DEVICE_POWER": 0x1471,
    // "SMSG_DEVICE_POWER": 0x1472,
    "QMSG_RETURN_HOME": 0x1069,
    "RMSG_RETURN_HOME": 0x106A,
    "QMSG_CLEAN_MODE": 0x106D,
    "RMSG_CLEAN_MODE": 0x106E,
    // "SMSG_MAP_UPDATE": 0x1164,
    "QMSG_SET_FAN_MODE": 0x10D9,
    "RMSG_SET_FAN_MODE": 0x10DA,
    // "CMSG_UNK_1": 0x111f,
    // "SMSG_UNK_1": 0x1120,
    // "SMSG_DEVICE_INUSE": 0x1325,
    "QMSG_DEVICE_INFO": 0x1465,
    "RMSG_DEVICE_INFO": 0x1466,
    // "SMSG_UNKNOWN_MAP": 0x7473,
    "QMSG_DEVICE_SIGNUP": 0x0FA1,
    "RMSG_DEVICE_SIGNUP": 0x0FA2,
};

const COMMANDS = {
    LOCATE_DEVICE: ["QMSG_LOCATE_DEVICE", "RMSG_LOCATE_DEVICE"],
    RETURN_HOME: ["QMSG_RETURN_HOME", "RMSG_RETURN_HOME"],
    CLEAN_MODE: ["QMSG_CLEAN_MODE", "RMSG_CLEAN_MODE"],
    SET_FAN_MODE: ["QMSG_SET_FAN_MODE", "RMSG_SET_FAN_MODE"],
};

function flip(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});
}

const OPNAMES = flip(OPCODES);

class MissingDataError extends Error {
    constructor(message = "missing data") {
        super(message);
        this.name = this.constructor.name;
    }
}

function unpack(data) {
    const packet = binary.parse(data)
        .word32lu("size")
        .tap(function(vars) {
            if (data.length < vars.size) {
                throw new MissingDataError();
            }
        })
        .word8("ctype")
        .word8("flow")
        .word32lu("deviceId")
        .word32lu("userId")
        .word64lu("sequence")
        .word16lu("opcode")
        .tap(function(vars) {
            this.buffer("payload", vars.size - 24);
        })
        .vars;

    return packet;
}

function pack(packet) {
    const size = 24 + packet.payload.length;
    const data = Buffer.alloc(24);
    let offset = 0;

    offset = data.writeUInt32LE(size, offset);
    offset = data.writeUInt8(packet.ctype, offset);
    offset = data.writeUInt8(packet.flow, offset);
    offset = data.writeUInt32LE(packet.userId, offset);
    offset = data.writeUInt32LE(packet.deviceId, offset);
    offset = data.writeBigUInt64LE(BigInt(packet.sequence), offset);
    data.writeUInt16LE(packet.opcode, offset);

    return Buffer.concat([data, packet.payload]);
}

class Packet {
    static fromBuffer(buffer) {
        return new Packet(unpack(buffer));
    }

    constructor({ ctype, flow, deviceId, userId, sequence, opcode, payload }) {
        this.ctype = ctype;
        this.flow = flow;
        this.deviceId = deviceId;
        this.userId = userId;
        this.sequence = sequence;
        this.opcode = opcode;
        this.payload = payload;
    }

    get opname() {
        return OPNAMES[this.opcode];
    }

    set opname(opname) {
        this.opcode = OPCODES[opname];
    }

    get data() {
        if (!this.opname) {
            return null;
        }

        const schema = root.lookupType(this.opname);
        const message = schema.decode(this.payload);

        return schema.toObject(message);
    }

    set data(data) {
        if (!data) {
            this.payload = Buffer.alloc(0);
            return;
        }

        const schema = root.lookupType(this.opname);
        const err = schema.verify(data);

        if (err) {
            throw new Error(`Message.data: ${err}`);
        }

        const message = schema.create(data);

        this.payload = schema.encode(message).finish();
    }

    clone() {
        return new Packet(this.toJSON());
    }

    toBuffer() {
        return pack(this);
    }

    toJSON() {
        const { ctype, flow, deviceId, userId, sequence, opcode, payload } = this;

        return { ctype, flow, deviceId, userId, sequence, opcode, payload };
    }

    toString() {
        return [
            `[S: ${this.sequence.toString(16)}]`,
            `[F: ${this.flow}]`,
            `[${this.opname || this.opcode.toString(16)}]`,
            `[U: ${this.userId}]`,
            `[D: ${this.deviceId}]`,
            this.data ? JSON.stringify(this.data) : (this.payload ? this.payload.toString("hex") : "")
        ].join(" ");
    }
}

class Builder {
    constructor() {
        this.userId = 0;
        this.deviceId = 0;
        this.ctype = 2;
        this.sequence = 0;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }

    build(opname, data) {
        const packet = new Packet({
            ctype: this.ctype,
            flow: 0,
            deviceId: this.deviceId,
            userId: this.userId,
            sequence: this.sequence++,
            opcode: null,
            payload: null,
        });

        packet.opname = opname;
        packet.data = data;

        return packet;
    }
}

class Message {
    constructor(socket, packet) {
        this.socket = socket;
        this.packet = packet;
    }

    send() {
        const data = this.packet.toBuffer();

        Logger.debug(`[P: ${this.socket.localPort}] ${this.packet}`);

        this.socket.write(data);
    }

    buildResponse(opname, data) {
        const packet = this.packet.clone();

        packet.opname = opname;
        packet.data = data;
        packet.flow += 1;

        return new Message(this.socket, packet);
    }
}

class Device {
    constructor(device) {
        this.id = device.id;
        this.deviceSerialNumber = device.deviceSerialNumber;
        this.softwareVersion = device.softwareversion;
    }
}

class Client extends EventEmitter {
    constructor(socket) {
        super();

        this.buffer = Buffer.alloc(0);
        this.builder = new Builder();
        this.socket = socket;
        this.socket.on("data", this.onData.bind(this));
    }

    destroy() {
        this.socket.destroy();
    }

    onData(data) {
        this.buffer = Buffer.concat([this.buffer, data]);

        let size = this.buffer.readUInt32LE();

        while (this.buffer.length > size) {
            const packet = Packet.fromBuffer(this.buffer);

            this.handlePacket(packet);
            this.buffer = this.buffer.slice(size);

            size = this.buffer.length > 4 ? this.buffer.readUInt32LE() : 0;
        }
    }

    handlePacket(packet) {
        Logger.debug(`[P: ${this.socket.localPort}] ${packet}`);

        if (packet.opname) {
            this.emit(packet.opname, new Message(this.socket, packet));
        }
    }

    async send(opname, data) {
        const packet = this.builder.build(opname, data);
        const message = new Message(this.socket, packet);

        await message.send();
    }
}

class Server {
    constructor(port, handlers) {
        this.handlers = handlers;
        this.client = null;
        this.server = net.createServer();
        this.server.listen({ port }, this.onListen.bind(this));
        this.server.on("connection", this.onConnection.bind(this));
    }

    onListen(e) {
        if (e) {
            throw e;
        }

        Logger.debug("listening ", this.server.address());
    }

    onConnection(socket) {
        Logger.debug(`[${socket.localPort}] connected ${socket.remoteAddress}`);

        if (this.client) {
            this.client.destroy();
        }

        this.client = new Client(socket);

        Object.entries(this.handlers).forEach(([opname, fn]) => {
            this.client.on(opname, fn);
        });
    }

    sendCommand(command, data = undefined) {
        return new Promise((resolve) =>{
            const [query, reply] = COMMANDS[command];

            this.client.once(reply, resolve);
            this.client.send(query, data);
        });
    }

    async sendMessage(opname, data = undefined) {
        await this.client.send(opname, data);
    }

    close() {
        if (this.client) {
            this.client.destroy();
        }

        this.server.close();
    }
}

const FAN_SPEEDS = {
    [FAN_SPEED_STATE_VALUE.OFF]: 0,
    [FAN_SPEED_STATE_VALUE.LOW]: 1,
    [FAN_SPEED_STATE_VALUE.MEDIUM]: 2,
    [FAN_SPEED_STATE_VALUE.HIGH]: 3,
};

const FAN_SPEEDS_REVERSED = flip(FAN_SPEEDS);

class DeviceStatus {
    constructor() {
        this.workMode = null;
        this.battery = 0;
        this.chargeStatus = false;
        this.cleanTime = 0;
        this.cleanSize = 0;
        this.type = 0;
        this.cleanPreference = 0;
    }

    update(data) {
        this.workMode = data.workMode;
        this.battery = data.battery;
        this.chargeStatus = data.chargeStatus;
        this.cleanTime = data.cleanTime;
        this.cleanSize = data.cleanSize;
        this.type = data.type;
        this.cleanPreference = data.cleanPreference;
    }

    getBatteryState() {
        let flag = BATTERY_FLAG.DISCHARGING;

        if (this.chargeStatus) {
            flag = this.battery === BATTERY_MAX ? BATTERY_FLAG.CHARGED : BATTERY_FLAG.CHARGING;
        }

        return new BatteryStateAttribute({
            level: this.battery * 100 / BATTERY_MAX,
            flag
        });
    }

    getStatusStateValue() {
        if (![0, 3].includes(this.type)) {
            return STATUS_STATE_VALUE.ERROR;
        }

        if (this.chargeStatus) {
            return STATUS_STATE_VALUE.DOCKED;
        }

        if ([5, 10].includes(this.workMode)) {
            return STATUS_STATE_VALUE.RETURNING;
        }

        if ([1, 25, 20].includes(this.workMode)) {
            return STATUS_STATE_VALUE.CLEANING;
        }

        if ([0, 4, 23, 29].includes(this.workMode)) {
            return STATUS_STATE_VALUE.IDLE;
        }

        return "unknown";
    }

    getStatusStateFlag() {
        if ([0, 1, 4, 5, 10, 11].includes(this.workMode)) {
            return STATUS_STATE_FLAG.NONE;
        }

        if ([7, 9, 14, 22, 36, 37, 38, 39, 40].includes(this.workMode)) {
            return STATUS_STATE_FLAG.SPOT;
        }

        return "unknown";
    }

    getStatusState() {
        const value = this.getStatusStateValue();
        const flag = this.getStatusStateFlag();

        return new StatusStateAttribute({
            value,
            flag
        });
    }

    getFanSpeedState() {
        return new FanSpeedStateAttribute({
            value: FAN_SPEEDS_REVERSED[this.cleanPreference]
        });
    }

    getLatestCleanupArea() {
        return new LatestCleanupStatisticsAttribute({
            type: LATEST_CLEANUP_STATISTICS_TYPE.AREA,
            value: this.cleanSize * 100
        });
    }

    getLatestCleanupDuration() {
        return new LatestCleanupStatisticsAttribute({
            type: LATEST_CLEANUP_STATISTICS_TYPE.DURATION,
            value: this.cleanTime * 60
        });
    }
}

class CecotecConga3490 {
    constructor(options) {
        this.device = null;
        this.deviceStatus = new DeviceStatus();
        this.events = options.events;
        this.robotState = new RobotState({
            map: require("../res/default_map")
        });
        this.handlers = {
            QMSG_PING: this.handlePing.bind(this),
            QMSG_DEVICE_LOGIN: this.handleDeviceLogin.bind(this),
            QMSG_DEVICE_SIGNUP: this.handleDeviceSignup.bind(this),
            QMSG_DEVICE_INFO: this.handleDeviceInfo.bind(this),
            QMSG_DEVICE_VERSION: this.handleDeviceVersion.bind(this),
            QMSG_DEVICE_OTA: this.handleDeviceOta.bind(this),
            QMSG_BATTERY_LEVEL: this.handleBatteryLevel.bind(this),
            QMSG_DEVICE_STATUS: this.handleDeviceStatus.bind(this),
        };
        this.cmdServer = new Server(4010, this.handlers);
        this.mapServer = new Server(4030, this.handlers);
    }

    shutdown() {
        this.cmdServer.close();
        this.mapServer.close();
    }

    async findRobot() {
        await this.cmdServer.sendCommand("LOCATE_DEVICE");
    }

    async getCurrentStatus() {
        return this.robotState;
    }

    async getFanSpeeds() {
        return FAN_SPEEDS;
    }

    async setFanSpeed(speed) {
        const mode = FAN_SPEEDS[speed];

        await this.cmdServer.sendCommand("SET_FAN_MODE", { mode });
    }

    async driveHome() {
        await this.cmdServer.sendCommand("RETURN_HOME", {
            unk1: 1
        });
    }

    async startCleaning() {
        await this.cmdServer.sendCommand("CLEAN_MODE", {
            mode: 1,
            unk1: 2
        });
    }

    async stopCleaning() {
        await this.cmdServer.sendCommand("CLEAN_MODE", {
            mode: 2,
            unk1: 2
        });
    }

    async pauseCleaning() {
        await this.cmdServer.sendCommand("CLEAN_MODE", {
            mode: 2,
            unk1: 2
        });
    }

    async handlePing(message) {
        await message.buildResponse("RMSG_PING").send();
    }

    async handleDeviceInfo(message) {
        await message.buildResponse("RMSG_DEVICE_INFO", { result: 0 }).send();
    }

    async handleDeviceVersion(message) {
        await message.buildResponse("RMSG_DEVICE_VERSION", { result: 0 }).send();
    }

    async handleDeviceOta(message) {
        await message.buildResponse("RMSG_DEVICE_OTA", { result: 0 }).send();
    }

    async handleDeviceLogin(message) {
        const deviceSerialNumber = message.packet.data.deviceSerialNumber;

        if (!this.device || this.device.id !== message.packet.deviceId) {
            await message.buildResponse("RMSG_DEVICE_LOGIN", {
                result: 12002,
                reason: `Device not registered(devsn: ${deviceSerialNumber})`
            }).send();
        } else {
            this.cmdServer.client.builder.setUserId(1/*message.packet.userId*/);
            this.cmdServer.client.builder.setDeviceId(message.packet.deviceId);

            await message.buildResponse("RMSG_DEVICE_LOGIN", { result: 0 }).send();
            await this.cmdServer.sendMessage("QMSG_CONNECT_DEVICE");
        }
    }

    async handleDeviceSignup(message) {
        let id;

        if (this.device && this.device.deviceSerialNumber === message.packet.data.deviceSerialNumber) {
            id = this.device.id;
        } else {
            id = Date.now() % 2 ** 32;

            this.device = new Device({
                ...message.packet.data,
                id
            });
        }

        await message.buildResponse("RMSG_DEVICE_SIGNUP", { result: 0, device: { id } }).send();
    }

    async handleBatteryLevel(message) {
        const data = message.packet.data;
        this.deviceStatus.update({
            battery: data.battery.level
        });

        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getBatteryState());

        this.events.emitStatusUpdated(this.robotState);

        await message.buildResponse("RMSG_BATTERY_LEVEL", { result: 0 }).send();
    }

    async handleDeviceStatus(message) {
        const data = message.packet.data;

        this.cmdServer.client.builder.setUserId(message.packet.userId);
        this.cmdServer.client.builder.setDeviceId(message.packet.deviceId);

        this.deviceStatus.update(data);
        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getBatteryState());
        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getStatusState());
        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getFanSpeedState());
        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getLatestCleanupArea());
        this.robotState.upsertFirstMatchingAttribute(this.deviceStatus.getLatestCleanupDuration());

        this.events.emitStatusUpdated(this.robotState);
    }
}

module.exports = CecotecConga3490;
