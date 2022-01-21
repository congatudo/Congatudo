const CurrentStatisticsCapability = require("../../../core/capabilities/CurrentStatisticsCapability");
const ValetudoDataPoint = require("../../../entities/core/ValetudoDataPoint");

/**
 * @extends CurrentStatisticsCapability<import("../CecotecCongaRobot")>
 */
class CecotecCurrentStatisticsCapability extends CurrentStatisticsCapability {
    /**
     * @return {Promise<Array<ValetudoDataPoint>>}
     */
    async getStatistics() {
        return [
            new ValetudoDataPoint({
                type: ValetudoDataPoint.TYPES.TIME,
                value: (this.robot.robot?.device.currentClean?.time || 0) * 60,
            }),
            new ValetudoDataPoint({
                type: ValetudoDataPoint.TYPES.AREA,
                value: (this.robot.robot?.device.currentClean?.size || 0) * 100,
            }),
        ];
    }

    getProperties() {
        return {
            availableStatistics: [
                ValetudoDataPoint.TYPES.TIME,
                ValetudoDataPoint.TYPES.AREA,
            ],
        };
    }
}

module.exports = CecotecCurrentStatisticsCapability;
