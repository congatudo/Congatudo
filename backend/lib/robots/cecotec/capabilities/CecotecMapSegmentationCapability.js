const MapSegmentationCapability = require("../../../core/capabilities/MapSegmentationCapability");

/**
 * @extends MapSegmentationCapability<import("../CecotecCongaRobot")>
 */
class CecotecMapSegmentationCapability extends MapSegmentationCapability {
    /**
     * Could be phrased as "cleanSegments" for vacuums or "mowSegments" for lawnmowers
     *
     *
     * @param {Array<import("../../../entities/core/ValetudoMapSegment")>} segments
     * @param {{iterations?: number}} [options]
     * @returns {Promise<void>}
     */
    async executeSegmentAction(segments, options = {}) {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        const map = this.robot.robot.device.map;

        if (!map) {
            throw new Error("There is no map in connected robot");
        }

        const segmentIds = segments.map(segment => {
            return String(segment.id);
        });
        const rooms = map.rooms.filter(room => {
            return segmentIds.includes(room.id.toString());
        });

        const iterations = Math.max(1, Math.min(2, Number(options.iterations) || 1));

        if (iterations > 1) {
            await this._setNativeRepeatClean(true);
        }

        await this.robot.robot.cleanRooms(rooms);
    }
    /**
     * @param {boolean} enabled
     * @returns {Promise<void>}
     * @private
     */
    async _setNativeRepeatClean(enabled) {
        const agnocRobot = this.robot.robot;

        if (!agnocRobot || typeof agnocRobot.sendRecv !== "function") {
            throw new Error("Segment iterations require native repeatClean support");
        }

        await agnocRobot.sendRecv(
            "USER_SET_DEVICE_CLEANPREFERENCE_REQ",
            "USER_SET_DEVICE_CLEANPREFERENCE_RSP",
            {
                repeatClean: Boolean(enabled)
            }
        );

        if (typeof agnocRobot.emit === "function") {
            agnocRobot.emit("updateDevice");
        }
    }

    /**
     * @returns {import("../../../core/capabilities/MapSegmentationCapability").MapSegmentationCapabilityProperties}
     */
    getProperties() {
        return {
            iterationCount: {
                min: 1,
                max: 2
            },
            customOrderSupport: false
        };
    }

}

module.exports = CecotecMapSegmentationCapability;
