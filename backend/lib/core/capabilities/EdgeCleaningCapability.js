const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

class EdgeCleaningCapability extends Capability {
    async start() {
        throw new NotImplementedError();
    }

    getProperties() {
        return {
            wholeHouse: true,
            segmentSelection: false
        };
    }

    getType() {
        return EdgeCleaningCapability.TYPE;
    }
}

EdgeCleaningCapability.TYPE = "EdgeCleaningCapability";

module.exports = EdgeCleaningCapability;
