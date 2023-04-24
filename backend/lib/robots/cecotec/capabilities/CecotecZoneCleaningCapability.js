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
        const areas = map.points( point => {
            return [
                map.toCoordinate(new Pixel({
                    x: point.pA.x,
                    y: offset - point.pA.y,
                })),
                map.toCoordinate(new Pixel({
                    x: point.pD.x,
                    y: offset - point.pD.y,
                })),
                map.toCoordinate(new Pixel({
                    x: point.pC.x,
                    y: offset - point.pC.y,
                })),
                map.toCoordinate(new Pixel({
                    x: point.pB.x,
                    y: offset - point.pB.y,
                })),
            ];
        });

        await this.robot.robot.cleanAreas(areas);
    }
};
