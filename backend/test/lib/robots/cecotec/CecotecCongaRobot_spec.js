const CecotecCongaRobot = require("../../../../lib/robots/cecotec/CecotecCongaRobot");
const Configuration = require("../../../../lib/Configuration");
const should = require("should");
const sinon = require("sinon");
const ValetudoEventStore = require("../../../../lib/ValetudoEventStore");
const { DeviceError } = require("@agnoc/core/lib/value-objects/device-error.value-object");
const { DeviceMap, Pixel, Coordinate, CloudServer, DeviceMode, DeviceState } = require("@agnoc/core");
const { ID } = require("@agnoc/core/lib/value-objects/id.value-object");
const { StatusStateAttribute } = require("../../../../lib/entities/state/attributes");
const { Zone } = require("@agnoc/core/lib/entities/zone.entity");

describe("CecotecCongaRobot", function () {
    beforeEach(function () {
        sinon.stub(Configuration.prototype, "loadConfig");
        sinon.stub(Configuration.prototype, "persist");
        sinon.stub(CloudServer.prototype, "listen");
    });

    afterEach(function () {
        Configuration.prototype.loadConfig.restore();
        Configuration.prototype.persist.restore();
        CloudServer.prototype.listen.restore();
    });

    const newConga = function (options) {
        return new CecotecCongaRobot({
            valetudoEventStore: new ValetudoEventStore(),
            config: new Configuration(),
            ...options,
        });
    };

    describe("getRestrictedZoneEntities", function () {
        it("Should return restricted zones", function (done) {
            const conga = newConga();
            const map = new DeviceMap({
                id: ID.generate(),
                size: new Pixel({ x: 100, y: 100 }),
                min: new Coordinate({ x: 0, y: 0 }),
                max: new Coordinate({ x: 100, y: 100 }),
                grid: [],
                rooms: [],
                restrictedZones: [
                    new Zone({
                        id: ID.generate(),
                        coordinates: [
                            new Coordinate({ x: 10, y: 0 }),
                            new Coordinate({ x: 0, y: 1 }),
                            new Coordinate({ x: 1, y: 1 }),
                            new Coordinate({ x: 1, y: 0 }),
                        ],
                    }),
                ],
            });

            const result = conga.getRestrictedZoneEntities(map);

            result.should.be.an.Array();
            result.should.have.length(1);

            done();
        });

        it("Should not throw an Exception on invalid map data", function (done) {
            const conga = newConga();
            const map = new DeviceMap({
                id: ID.generate(),
                size: new Pixel({ x: 100, y: 100 }),
                min: new Coordinate({ x: 0, y: 0 }),
                max: new Coordinate({ x: 100, y: 100 }),
                grid: [],
                rooms: [],
                restrictedZones: [
                    new Zone({
                        id: ID.generate(),
                        coordinates: [
                            new Coordinate({ x: -100, y: 0 }),
                            new Coordinate({ x: 0, y: 1 }),
                            new Coordinate({ x: 1, y: 1 }),
                            new Coordinate({ x: 1, y: 0 }),
                        ],
                    }),
                ],
            });
            let result;

            should(() => {
                result = conga.getRestrictedZoneEntities(map);
            }).not.throw();

            result.should.be.an.Array();
            result.should.have.length(0);

            done();
        });
    });

    describe("getStatusState", function () {
        it("Should not mark startup self-check as error state", function (done) {
            const conga = newConga();
            const status = conga.getStatusState({
                device: {
                    error: { value: DeviceError.VALUE.ROBOT_SELF_CHECKING },
                    mode: { value: DeviceMode.VALUE.NONE },
                    state: { value: DeviceState.VALUE.DOCKED },
                },
            });

            status.value.should.equal(StatusStateAttribute.VALUE.DOCKED);
            status.metaData.error_description.should.equal("Robot self-checking. Please wait.");

            done();
        });

        it("Should still surface dust bin full as error state", function (done) {
            const conga = newConga();
            const status = conga.getStatusState({
                device: {
                    error: { value: DeviceError.VALUE.DUST_BOX_FULL },
                    mode: { value: DeviceMode.VALUE.NONE },
                    state: { value: DeviceState.VALUE.DOCKED },
                },
            });

            status.value.should.equal(StatusStateAttribute.VALUE.ERROR);
            status.metaData.error_description.should.equal("The dust bin is full. Please empty it.");

            done();
        });

        it("Should keep error state when device already reports error", function (done) {
            const conga = newConga();
            const status = conga.getStatusState({
                device: {
                    error: { value: DeviceError.VALUE.ROBOT_SELF_CHECKING },
                    mode: { value: DeviceMode.VALUE.NONE },
                    state: { value: DeviceState.VALUE.ERROR },
                },
            });

            status.value.should.equal(StatusStateAttribute.VALUE.ERROR);

            done();
        });
    });
});
