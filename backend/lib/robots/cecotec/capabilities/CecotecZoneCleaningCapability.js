const ZoneCleaningCapability = require("../../../core/capabilities/ZoneCleaningCapability");
const {Pixel} = require("@agnoc/core");

/**
 * @extends ZoneCleaningCapability<import("../CecotecCongaRobot")>
 */
module.exports = class CecotecZoneCleaningCapability extends ZoneCleaningCapability {

    async start(options) {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        const map = this.robot.robot.device.map;

        if (!map) {
            throw new Error("There is no map in connected robot");
        }

        const offset = map.size.y;
        let areas = [];
        options.zones.forEach(zone => {
            areas.push(
                [
                    map.toCoordinate(new Pixel({
                        x: zone.points.pA.x,
                        y: offset - zone.points.pA.y,
                    })),
                    map.toCoordinate(new Pixel({
                        x: zone.points.pD.x,
                        y: offset - zone.points.pD.y,
                    })),
                    map.toCoordinate(new Pixel({
                        x: zone.points.pC.x,
                        y: offset - zone.points.pC.y,
                    })),
                    map.toCoordinate(new Pixel({
                        x: zone.points.pB.x,
                        y: offset - zone.points.pB.y,
                    })),
                ]);
        });

        await this.robot.robot.cleanAreas(areas);
    }

    /**
     * @returns {import("../../../core/capabilities/ZoneCleaningCapability").ZoneCleaningCapabilityProperties}
     */
    getProperties() {
        return {
            zoneCount: {
                min: 1,
                max: 10
            },
            iterationCount: {
                min: 1,
                max: 2
            }
        };
    }
};
