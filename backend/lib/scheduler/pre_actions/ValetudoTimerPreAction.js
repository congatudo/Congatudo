const NotImplementedError = require("../../core/NotImplementedError");


class ValetudoTimerPreAction {
    /**
     * @abstract
     * @param {object} options
     * @param {import("../../core/ValetudoRobot")} options.robot
     */
    constructor(options) {
        this.robot = options.robot;
    }

    /**
     * @returns {Promise<void>}
     */
    async run() {
        throw new NotImplementedError();
    }
}

module.exports = ValetudoTimerPreAction;
