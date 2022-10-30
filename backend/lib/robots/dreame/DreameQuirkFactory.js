const DreameMiotHelper = require("./DreameMiotHelper");
const DreameMiotServices = require("./DreameMiotServices");
const DreameUtils = require("./DreameUtils");
const Quirk = require("../../core/Quirk");

class DreameQuirkFactory {
    /**
     *
     * @param {object} options
     * @param {import("./DreameValetudoRobot")} options.robot
     */
    constructor(options) {
        this.robot = options.robot;
        this.helper = new DreameMiotHelper({robot: this.robot});
    }
    /**
     * @param {string} id
     */
    getQuirk(id) {
        switch (id) {
            case DreameQuirkFactory.KNOWN_QUIRKS.CARPET_MODE_SENSITIVITY:
                return new Quirk({
                    id: id,
                    title: "Carpet Mode Sensitivity",
                    description: "Depending on the type of carpet in your home, the carpet mode might not trigger as expected. This tunable can help in these situations.",
                    options: ["low", "medium", "high"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.CARPET_MODE_SENSITIVITY.PIID
                        );

                        switch (res) {
                            case 3:
                                return "high";
                            case 2:
                                return "medium";
                            case 1:
                                return "low";
                            default:
                                throw new Error(`Received invalid sensitivity ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "high":
                                val = 3;
                                break;
                            case "medium":
                                val = 2;
                                break;
                            case "low":
                                val = 1;
                                break;
                            default:
                                throw new Error(`Received invalid sensitivity ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.CARPET_MODE_SENSITIVITY.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.TIGHT_MOP_PATTERN:
                return new Quirk({
                    id: id,
                    title: "Tight Mop Pattern",
                    description: "Enabling this makes your robot move in a much tighter pattern when mopping.",
                    options: ["on", "off"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.TIGHT_MOP_PATTERN.PIID
                        );

                        switch (res) {
                            case 1:
                                return "on";
                            case 0:
                                return "off";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "on":
                                val = 1;
                                break;
                            case "off":
                                val = 0;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.TIGHT_MOP_PATTERN.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.AUTO_EMPTY_INTERVAL:
                return new Quirk({
                    id: id,
                    title: "Auto-empty Interval",
                    description: "Depending on the size of your home, you might not need to auto-empty the dustbin on " +
                        "every single cleanup. Note that you can also disable auto-empty entirely and manually trigger " +
                        "it via REST and/or MQTT instead of changing the interval.",
                    options: ["every_cleanup", "every_second_cleanup", "every_third_cleanup"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].AUTO_EMPTY_DOCK.SIID,
                            DreameMiotServices["GEN2"].AUTO_EMPTY_DOCK.PROPERTIES.INTERVAL.PIID
                        );

                        switch (res) {
                            case 1:
                                return "every_cleanup";
                            case 2:
                                return "every_second_cleanup";
                            case 3:
                                return "every_third_cleanup";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "every_cleanup":
                                val = 1;
                                break;
                            case "every_second_cleanup":
                                val = 2;
                                break;
                            case "every_third_cleanup":
                                val = 3;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].AUTO_EMPTY_DOCK.SIID,
                            DreameMiotServices["GEN2"].AUTO_EMPTY_DOCK.PROPERTIES.INTERVAL.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.OBSTACLE_AVOIDANCE:
                return new Quirk({
                    id: id,
                    title: "Obstacle Avoidance",
                    description: "It is possible to disable the obstacle detection if it is causing issues " +
                        "such as the robot not driving onto some carpets or the cleanup taking a very long time.",
                    options: ["on", "off"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.OBSTACLE_AVOIDANCE.PIID
                        );

                        switch (res) {
                            case 1:
                                return "on";
                            case 0:
                                return "off";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "on":
                                val = 1;
                                break;
                            case "off":
                                val = 0;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.OBSTACLE_AVOIDANCE.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY:
                return new Quirk({
                    id: id,
                    title: "Mop Cleaning Frequency",
                    description: "Determine how often the robot should clean and re-wet its mopping pads during a cleanup.",
                    options: ["every_segment", "every_5_m2", "every_10_m2", "every_15_m2", "every_20_m2", "every_25_m2"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
                        );

                        const deserializedResponse = DreameUtils.DESERIALIZE_MOP_DOCK_SETTINGS(res);

                        switch (deserializedResponse.padCleaningFrequency) {
                            case 0:
                                return "every_segment";
                            case 5:
                                return "every_5_m2";
                            case 10:
                                return "every_10_m2";
                            case 15:
                                return "every_15_m2";
                            case 20:
                                return "every_20_m2";
                            case 25:
                                return "every_25_m2";
                            default:
                                throw new Error(`Received invalid value ${deserializedResponse.operationMode}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "every_segment":
                                val = 0;
                                break;
                            case "every_5_m2":
                                val = 5;
                                break;
                            case "every_10_m2":
                                val = 10;
                                break;
                            case "every_15_m2":
                                val = 15;
                                break;
                            case "every_20_m2":
                                val = 20;
                                break;
                            case "every_25_m2":
                                val = 25;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
                        );
                        const deserializedResponse = DreameUtils.DESERIALIZE_MOP_DOCK_SETTINGS(res);

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID,
                            DreameUtils.SERIALIZE_MOP_DOCK_SETTINGS({
                                waterGrade: deserializedResponse.waterGrade,
                                padCleaningFrequency: val,
                                operationMode: deserializedResponse.operationMode
                            })
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_UV_TREATMENT:
                return new Quirk({
                    id: id,
                    title: "Wastewater UV Treatment",
                    description: "Disinfect the waste water tank after each successful cleanup using the in-built UV-C light.",
                    options: ["on", "off"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_UV_TREATMENT.PIID
                        );

                        switch (res) {
                            case 1:
                                return "on";
                            case 0:
                                return "off";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "on":
                                val = 1;
                                break;
                            case "off":
                                val = 0;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_UV_TREATMENT.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.CARPET_DETECTION_SENSOR:
                return new Quirk({
                    id: id,
                    title: "Carpet detection sensor",
                    description: "Detect carpets using a dedicated sensor",
                    options: ["on", "off"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.CARPET_DETECTION_SENSOR.PIID
                        );

                        switch (res) {
                            case 1:
                                return "on";
                            case 0:
                                return "off";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "on":
                                val = 1;
                                break;
                            case "off":
                                val = 0;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.CARPET_DETECTION_SENSOR.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_LIFT_CARPET_BEHAVIOUR:
                return new Quirk({
                    id: id,
                    title: "Carpet Behaviour",
                    description: "Define how the robot should handle carpets when the mop is attached",
                    options: ["Lift Mop", "Avoid Carpet"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_LIFT_CARPET_BEHAVIOUR.PIID
                        );

                        switch (res) {
                            case 2:
                                return "Lift Mop";
                            case 1:
                                return "Avoid Carpet";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "Lift Mop":
                                val = 2;
                                break;
                            case "Avoid Carpet":
                                val = 1;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_LIFT_CARPET_BEHAVIOUR.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_DRYING_TIME:
                return new Quirk({
                    id: id,
                    title: "Mop Drying Time",
                    description: "Define how long the mop should be dried after a cleanup",
                    options: ["2h", "3h", "4h"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DRYING_TIME.PIID
                        );

                        switch (res) {
                            case 2:
                                return "2h";
                            case 3:
                                return "3h";
                            case 4:
                                return "4h";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "2h":
                                val = 2;
                                break;
                            case "3h":
                                val = 3;
                                break;
                            case "4h":
                                val = 3;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DRYING_TIME.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.BASIC_AI_CAMERA_SETTINGS:
                /*
                    The AI_CAMERA_SETTINGS PIID actually contains a list of flags each as one bit
                    I haven't figured out what all of those mean just yet.

                    Therefore, for now this quirk will work with 0b01111 and 0b11111 as hardcoded values
                    0b01111 is the default after a factory reset on the L10SU
                 */
                return new Quirk({
                    id: id,
                    title: "Basic AI Camera Settings",
                    description: "Select if the AI Model should look for Pet waste",
                    options: ["No Pets", "Pets"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.AI_CAMERA_SETTINGS.PIID
                        );

                        switch (res) {
                            case 0b01011: //X10+ default state
                            case 0b01111: //L10SU default state
                                return "No Pets";
                            case 0b11111:
                                return "Pets";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "No Pets":
                                val = 0b01111;
                                break;
                            case "Pets":
                                val = 0b11111;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.AI_CAMERA_SETTINGS.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_DETERGENT:
                return new Quirk({
                    id: id,
                    title: "Detergent",
                    description: "Select if the Dock should automatically add detergent to the water",
                    options: ["on", "off", "Missing detergent cartridge"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_DETERGENT.PIID
                        );

                        switch (res) {
                            case 0:
                                return "off";
                            case 1:
                                return "on";
                            case 2:
                                return "Missing detergent cartridge";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "off":
                                val = 0;
                                break;
                            case "on":
                                val = 1;
                                break;
                            case "Missing detergent cartridge":
                                throw new Error("This informational message is not a user-selectable option");
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_DETERGENT.PIID,
                            val
                        );
                    }
                });
            case DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WET_DRY_SWITCH:
                return new Quirk({
                    id: id,
                    title: "Mopping Mode",
                    description: "Select \"dry\" if you don't want the dock to wet the mops before cleaning. This can be useful if there's a spill that you want to mop up.",
                    options: ["Wet", "Dry"],
                    getter: async () => {
                        const res = await this.helper.readProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_WET_DRY_SWITCH.PIID
                        );

                        switch (res) {
                            case 1:
                                return "Wet";
                            case 0:
                                return "Dry";
                            default:
                                throw new Error(`Received invalid value ${res}`);
                        }
                    },
                    setter: async (value) => {
                        let val;

                        switch (value) {
                            case "Wet":
                                val = 1;
                                break;
                            case "Dry":
                                val = 0;
                                break;
                            default:
                                throw new Error(`Received invalid value ${value}`);
                        }

                        return this.helper.writeProperty(
                            DreameMiotServices["GEN2"].VACUUM_2.SIID,
                            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MOP_DOCK_WET_DRY_SWITCH.PIID,
                            val
                        );
                    }
                });
            default:
                throw new Error(`There's no quirk with id ${id}`);
        }
    }
}

DreameQuirkFactory.KNOWN_QUIRKS = {
    CARPET_MODE_SENSITIVITY: "f8cb91ab-a47a-445f-b300-0aac0d4937c0",
    TIGHT_MOP_PATTERN: "8471c118-f1e1-4866-ad2e-3c11865a5ba8",
    AUTO_EMPTY_INTERVAL: "d38118f2-fb5d-4ed9-b668-262db15e5269",
    OBSTACLE_AVOIDANCE: "4e386a76-b5f9-4f12-b04e-b8539a507163",
    MOP_DOCK_MOP_CLEANING_FREQUENCY: "a6709b18-57af-4e11-8b4c-8ae33147ab34",
    MOP_DOCK_UV_TREATMENT: "7f97b603-967f-44f0-9dfb-35bcdc21f433",
    CARPET_DETECTION_SENSOR: "38362a9d-6c8f-430a-aaaa-fd454e93e816",
    MOP_LIFT_CARPET_BEHAVIOUR: "33ea65f7-f9a2-4462-a696-36019340a3e1",
    MOP_DRYING_TIME: "516a1025-9c56-46e0-ac9b-a5007088d24a",
    BASIC_AI_CAMERA_SETTINGS: "6305a7bc-cc10-4251-99e1-1bf567fee74c",
    MOP_DOCK_DETERGENT: "a2a03d42-c710-45e5-b53a-4bc62778589f",
    MOP_DOCK_WET_DRY_SWITCH: "66adac0f-0a16-4049-b6ac-080ef702bb39",
};

module.exports = DreameQuirkFactory;
