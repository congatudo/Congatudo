import Map, {MapContainer, MapProps, MapState, usePendingMapAction} from "./Map";
import {Capability} from "../api";
import GoToTargetClientStructure from "./structures/client_structures/GoToTargetClientStructure";
import {ActionsContainer} from "./Styled";
import SegmentActions from "./actions/live_map_actions/SegmentActions";
import SegmentLabelMapStructure from "./structures/map_structures/SegmentLabelMapStructure";
import ZoneActions from "./actions/live_map_actions/ZoneActions";
import ZoneClientStructure from "./structures/client_structures/ZoneClientStructure";
import GoToActions from "./actions/live_map_actions/GoToActions";
import {TapTouchHandlerEvent} from "./utils/touch_handling/events/TapTouchHandlerEvent";
import React from "react";
import {LiveMapModeSwitcher} from "./LiveMapModeSwitcher";


export type LiveMapMode = "segments" | "zones" | "goto" | "none";
export type LiveMapZoneOrderMode = "manual" | "auto";
const LIVE_MAP_MODE_LOCAL_STORAGE_KEY = "live-map-mode";
const LIVE_MAP_ZONE_ORDER_MODE_LOCAL_STORAGE_KEY = "live-map-zone-order-mode";

const getLiveMapZoneCenter = (zone: ZoneClientStructure): {x: number, y: number} => {
    return {
        x: (zone.x0 + zone.x1) / 2,
        y: (zone.y0 + zone.y1) / 2
    };
};

const getLiveMapSquaredDistance = (a: {x: number, y: number}, b: {x: number, y: number}): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return dx * dx + dy * dy;
};

const getAutomaticLiveMapZoneOrder = (zones: ZoneClientStructure[]): ZoneClientStructure[] => {
    if (zones.length <= 2) {
        return zones;
    }

    const remaining = [...zones];

    remaining.sort((a, b) => {
        const ca = getLiveMapZoneCenter(a);
        const cb = getLiveMapZoneCenter(b);

        return (ca.x + ca.y) - (cb.x + cb.y);
    });

    const ordered: ZoneClientStructure[] = [];
    let current = remaining.shift();

    while (current !== undefined) {
        ordered.push(current);

        if (remaining.length === 0) {
            break;
        }

        const currentCenter = getLiveMapZoneCenter(current);
        let bestIndex = 0;
        let bestDistance = getLiveMapSquaredDistance(currentCenter, getLiveMapZoneCenter(remaining[0]));

        for (let i = 1; i < remaining.length; i++) {
            const distance = getLiveMapSquaredDistance(currentCenter, getLiveMapZoneCenter(remaining[i]));

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = i;
            }
        }

        current = remaining.splice(bestIndex, 1)[0];
    }

    return ordered;
};


interface LiveMapProps extends MapProps {
    supportedCapabilities: {
        [Capability.MapSegmentation]: boolean,
        [Capability.ZoneCleaning]: boolean,
        [Capability.GoToLocation]: boolean
    }
}

interface LiveMapState extends MapState {
    mode: LiveMapMode,
    zoneOrderMode: LiveMapZoneOrderMode,
    zones: Array<ZoneClientStructure>,
    goToTarget: GoToTargetClientStructure | undefined
}

class LiveMap extends Map<LiveMapProps, LiveMapState> {
    private readonly supportedModes: Array<LiveMapMode>;

    constructor(props: LiveMapProps) {
        super(props);

        this.supportedModes = [];

        if (props.supportedCapabilities[Capability.MapSegmentation]) {
            this.supportedModes.push("segments");
        }
        if (props.supportedCapabilities[Capability.ZoneCleaning]) {
            this.supportedModes.push("zones");
        }
        if (props.supportedCapabilities[Capability.GoToLocation]) {
            this.supportedModes.push("goto");
        }

        let modeIdxToUse = 0;
        let zoneOrderModeToUse: LiveMapZoneOrderMode = "manual";
        try {
            const previousMode = window.localStorage.getItem(LIVE_MAP_MODE_LOCAL_STORAGE_KEY);
            const previousZoneOrderMode = window.localStorage.getItem(LIVE_MAP_ZONE_ORDER_MODE_LOCAL_STORAGE_KEY);

            modeIdxToUse = Math.max(
                this.supportedModes.findIndex(e => e === previousMode),
                0 //default to the first if not defined or not supported
            );

            zoneOrderModeToUse = previousZoneOrderMode === "auto" ? "auto" : "manual";
        } catch (e) {
            /* users with non-working local storage will have to live with the defaults */
        }

        this.state = {
            mode: this.supportedModes[modeIdxToUse] ?? "none",
            zoneOrderMode: zoneOrderModeToUse,
            selectedSegmentIds: [],
            selectedZoneIds: [],
            zones: [],
            goToTarget: undefined
        };
    }

    protected updateState() : void {
        super.updateState();

        const zones = this.structureManager.getClientStructures().filter(s => {
            return s.type === ZoneClientStructure.TYPE;
        }) as Array<ZoneClientStructure>;

        const zonesForLabels = this.state.zoneOrderMode === "auto" ? getAutomaticLiveMapZoneOrder(zones) : zones;

        zones.forEach(zone => {
            zone.orderLabel = undefined;
        });

        zonesForLabels.forEach((zone, idx) => {
            zone.orderLabel = `${idx + 1}`;
        });

        this.setState({
            zones: zones,
            goToTarget: this.structureManager.getClientStructures().find(s => {
                return s.type === GoToTargetClientStructure.TYPE;
            }) as GoToTargetClientStructure | undefined
        });
    }


    protected onTap(evt: TapTouchHandlerEvent): boolean | void {
        if (super.onTap(evt)) {
            return true;
        }

        const {x, y} = this.relativeCoordinatesToCanvas(evt.x0, evt.y0);
        const tappedPointInMapSpace = this.ctxWrapper.mapPointToCurrentTransform(x, y);

        switch (this.state.mode) {
            case "segments": {
                const intersectingSegmentId = this.mapLayerManager.getIntersectingSegment(tappedPointInMapSpace.x, tappedPointInMapSpace.y);

                if (intersectingSegmentId) {
                    const segmentLabels = this.structureManager.getMapStructures().filter(s => {
                        return s.type === SegmentLabelMapStructure.TYPE;
                    }) as Array<SegmentLabelMapStructure>;

                    const matchedSegmentLabel = segmentLabels.find(l => {
                        return l.id === intersectingSegmentId;
                    });


                    if (matchedSegmentLabel) {
                        matchedSegmentLabel.onTap();

                        this.updateState();
                        this.redrawLayers();

                        return true;
                    }
                }

                break;
            }

            case "goto": {
                if (
                    this.structureManager.getClientStructures().filter(s => {
                        return s.type !== GoToTargetClientStructure.TYPE;
                    }).length === 0
                ) {
                    this.structureManager.getClientStructures().forEach(s => {
                        if (s.type === GoToTargetClientStructure.TYPE) {
                            this.structureManager.removeClientStructure(s);
                        }
                    });
                    this.structureManager.addClientStructure(new GoToTargetClientStructure(tappedPointInMapSpace.x, tappedPointInMapSpace.y));


                    this.updateState();
                    this.draw();

                    return true;
                }

                break;
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<MapProps>, prevState: Readonly<MapState>): void {
        super.componentDidUpdate(prevProps, prevState);

        if (
            this.state.selectedSegmentIds.length > 0 ||
            this.state.zones.length > 0 ||
            this.state.goToTarget !== undefined
        ) {
            usePendingMapAction.setState({hasPendingMapAction: true});
        } else {
            usePendingMapAction.setState({hasPendingMapAction: false});
        }
    }

    render(): React.ReactElement {
        return (
            <MapContainer style={{overflow: "hidden"}}>
                <canvas
                    ref={this.canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        imageRendering: "crisp-edges"
                    }}
                />
                {
                    this.supportedModes.length > 0 &&
                    <LiveMapModeSwitcher
                        supportedModes={this.supportedModes}
                        currentMode={this.state.mode}
                        setMode={(newMode) => {
                            this.structureManager.getMapStructures().forEach(s => {
                                if (s.type === SegmentLabelMapStructure.TYPE) {
                                    const label = s as SegmentLabelMapStructure;

                                    label.selected = false;
                                }
                            });

                            this.structureManager.getClientStructures().forEach(s => {
                                if (s.type === GoToTargetClientStructure.TYPE) {
                                    this.structureManager.removeClientStructure(s);
                                }

                                if (s.type === ZoneClientStructure.TYPE) {
                                    this.structureManager.removeClientStructure(s);
                                }
                            });

                            this.updateState();

                            this.redrawLayers();

                            this.setState({
                                mode: newMode
                            });

                            try {
                                window.localStorage.setItem(LIVE_MAP_MODE_LOCAL_STORAGE_KEY, newMode);
                            } catch (e) {
                                /* intentional */
                            }
                        }}
                    />
                }

                <ActionsContainer>
                    {
                        this.state.mode === "segments" &&

                        <SegmentActions
                            segments={this.state.selectedSegmentIds}
                            onClear={() => {
                                this.structureManager.getMapStructures().forEach(s => {
                                    if (s.type === SegmentLabelMapStructure.TYPE) {
                                        const label = s as SegmentLabelMapStructure;

                                        label.selected = false;
                                    }
                                });
                                this.updateState();

                                this.redrawLayers();
                            }}
                        />
                    }
                    {
                        this.state.mode === "zones" &&

                        <ZoneActions
                            zones={this.state.zones}
                            zoneOrderMode={this.state.zoneOrderMode}
                            onZoneOrderModeToggle={() => {
                                const newZoneOrderMode: LiveMapZoneOrderMode = this.state.zoneOrderMode === "manual" ? "auto" : "manual";

                                this.setState({
                                    zoneOrderMode: newZoneOrderMode
                                }, () => {
                                    this.updateState();
                                    this.redrawLayers();
                                });

                                try {
                                    window.localStorage.setItem(LIVE_MAP_ZONE_ORDER_MODE_LOCAL_STORAGE_KEY, newZoneOrderMode);
                                } catch (e) {
                                    /* intentional */
                                }
                            }}
                            convertPixelCoordinatesToCMSpace={(coordinates => {
                                return this.structureManager.convertPixelCoordinatesToCMSpace(coordinates);
                            })}
                            onClear={() => {
                                this.structureManager.getClientStructures().forEach(s => {
                                    if (s.type === ZoneClientStructure.TYPE) {
                                        this.structureManager.removeClientStructure(s);
                                    }
                                });

                                this.updateState();

                                this.draw();
                            }}
                            onAdd={() => {
                                const currentCenter = this.getCurrentViewportCenterCoordinatesInPixelSpace();

                                const p0 = {
                                    x: currentCenter.x -15,
                                    y: currentCenter.y -15
                                };
                                const p1 = {
                                    x: currentCenter.x +15,
                                    y: currentCenter.y +15
                                };

                                this.structureManager.addClientStructure(new ZoneClientStructure(
                                    p0.x, p0.y,
                                    p1.x, p1.y,
                                    true
                                ));

                                this.updateState();

                                this.draw();
                            }}
                        />
                    }
                    {
                        this.state.mode === "goto" &&

                        <GoToActions
                            goToTarget={this.state.goToTarget}
                            convertPixelCoordinatesToCMSpace={(coordinates => {
                                return this.structureManager.convertPixelCoordinatesToCMSpace(coordinates);
                            })}
                            onClear={() => {
                                this.structureManager.getClientStructures().forEach(s => {
                                    if (s.type === GoToTargetClientStructure.TYPE) {
                                        this.structureManager.removeClientStructure(s);
                                    }
                                });
                                this.updateState();

                                this.draw();
                            }}
                        />
                    }
                </ActionsContainer>
            </MapContainer>
        );
    }
}

export default LiveMap;
