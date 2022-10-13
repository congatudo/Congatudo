const SpeakerVolumeControlCapability = require("../../../core/capabilities/SpeakerVolumeControlCapability");
const { DeviceVoice } = require("@agnoc/core");

/**
 * @extends SpeakerVolumeControlCapability<import("../CecotecCongaRobot")>
 */
class CecotecSpeakerVolumeControlCapability extends SpeakerVolumeControlCapability {
    /**
     * Returns the current voice volume as percentage
     *
     * @returns {Promise<number>}
     */
    async getVolume() {
        if (!this.robot.robot || !this.robot.robot.device.config) {
            return 0;
        }

        return this.robot.robot.device.config.voice.volume;
    }

    /**
     * Sets the speaker volume
     *
     * @param {number} value
     * @returns {Promise<void>}
     */
    async setVolume(value) {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.setVoice(
            new DeviceVoice({
                isEnabled: true,
                volume: value,
            })
        );
    }

    getAlsaControlName() {
        return "Lineout volume control";
    }
}

module.exports = CecotecSpeakerVolumeControlCapability;
