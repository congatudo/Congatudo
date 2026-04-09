const BasicControlCapability = require("../../../core/capabilities/BasicControlCapability");
const AttachmentStateAttribute = require("../../../entities/state/attributes/AttachmentStateAttribute");

/**
 * @extends BasicControlCapability<import("../CecotecCongaRobot")>
 */
module.exports = class CecotecBasicControlCapability extends BasicControlCapability {
    async start() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        const mopAttachment = this.robot.state.getFirstMatchingAttribute({
            attributeClass: AttachmentStateAttribute.name,
            attributeType: AttachmentStateAttribute.TYPE.MOP,
        });

        // Sync agnoc's mop state so start() dispatches the correct opcode:
        // DEVICE_MOP_FLOOR_CLEAN_REQ when mop is attached, DEVICE_AUTO_CLEAN_REQ otherwise.
        this.robot.robot.device.updateHasMopAttached(mopAttachment?.attached === true);

        await this.robot.robot.start();
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
};
