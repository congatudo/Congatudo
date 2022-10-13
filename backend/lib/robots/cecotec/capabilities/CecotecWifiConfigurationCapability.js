const LinuxWifiConfigurationCapability = require("../../common/linuxCapabilities/LinuxWifiConfigurationCapability");
const ValetudoWifiStatus = require("../../../entities/core/ValetudoWifiStatus");

/**
 * @extends LinuxWifiConfigurationCapability<import("../CecotecCongaRobot")>
 */
class CecotecWifiConfigurationCapability extends LinuxWifiConfigurationCapability {
    /**
     * @returns {Promise<ValetudoWifiStatus>}
     */
    async getWifiStatus() {
        if (this.robot.config.get("embedded") === true) {
            return await super.getWifiStatus();
        }

        throw new Error("Cannot get Wi-Fi configuration for Cecotec vacuums");
    }

    /**
     * @returns {Promise<void>}
     */
    async setWifiConfiguration() {
        throw new Error("Cannot set Wi-Fi configuration for Cecotec vacuums");
    }
}

module.exports = CecotecWifiConfigurationCapability;
