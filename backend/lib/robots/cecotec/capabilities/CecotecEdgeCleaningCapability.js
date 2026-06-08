const EdgeCleaningCapability = require("../../../core/capabilities/EdgeCleaningCapability");

module.exports = class CecotecEdgeCleaningCapability extends EdgeCleaningCapability {
    async start() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        if (typeof this.robot.robot.cleanEdgesDirect !== "function") {
            throw new TypeError("Agnoc cleanEdgesDirect() is not available");
        }

        await this.robot.robot.cleanEdgesDirect();
    }

    getProperties() {
        return {
            wholeHouse: true,
            segmentSelection: false
        };
    }
};
