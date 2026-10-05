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

    describe("getSegmentEntities", function () {
        it("Should fill a room whose median pixel falls on an obstacle", function (done) {
            const conga = newConga();
            // 10x6 room with a bed (0) at x 2..7, y 2..5: the floor is an inverted U
            const fullMap = Array.from({ length: 10 }, (_, x) => {
                return Array.from({ length: 6 }, (_, y) => {
                    return x >= 2 && x <= 7 && y >= 2 ? 0 : 255;
                });
            });
            // reported pixels (0,5), (9,5), (5,0): their median (5,5) is on the bed
            const map = {
                size: { y: 100 },
                rooms: [{
                    id: { value: 1 },
                    isEnabled: true,
                    name: "Bedroom",
                    pixels: [{ x: 0, y: 95 }, { x: 9, y: 95 }, { x: 5, y: 100 }],
                }],
            };

            const segments = conga.getSegmentEntities(map, fullMap);

            segments.should.have.length(1);
            segments[0].dimensions.pixelCount.should.equal(36);
            fullMap.flat().should.not.containEql(255);

            done();
        });

        it("Should not let a door line split the room behind it", function (done) {
            const conga = newConga();
            // 12x5 free floor: room A is x 0..4, hallway B is x 5..11
            const fullMap = Array.from({ length: 12 }, () => {
                return new Array(5).fill(255);
            });
            const room = (id, cells) => {
                return {
                    id: { value: id },
                    isEnabled: true,
                    name: "room" + id,
                    pixels: cells.map(([x, y]) => {
                        return { x: x, y: 100 - y };
                    }),
                };
            };
            const outlineA = [];
            const outlineB = [];

            for (let x = 0; x < 12; x++) {
                for (let y = 0; y < 5; y++) {
                    if (x <= 4 && (x === 0 || x === 4 || y === 0 || y === 4)) {
                        outlineA.push([x, y]); // includes the door line at x = 4
                    } else if (x >= 5 && (x === 11 || y === 0 || y === 4)) {
                        outlineB.push([x, y]); // open towards the door
                    }
                }
            }

            const segments = conga.getSegmentEntities({ size: { y: 100 }, rooms: [room(1, outlineA), room(2, outlineB)] }, fullMap);

            segments.map(s => {
                return s.dimensions.pixelCount;
            }).should.eql([25, 35]);
            segments[0].dimensions.x.max.should.equal(4);

            done();
        });
    });
});
