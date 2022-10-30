import Map, {MapProps, MapState, usePendingMapAction} from "./Map";
import {Capability} from "../api";
import GoToTargetClientStructure from "./structures/client_structures/GoToTargetClientStructure";
import LocateAction from "./actions/live_map_actions/LocateAction";
import {ActionsContainer} from "./Styled";
import SegmentActions from "./actions/live_map_actions/SegmentActions";
import SegmentLabelMapStructure from "./structures/map_structures/SegmentLabelMapStructure";
import ZoneActions from "./actions/live_map_actions/ZoneActions";
import ZoneClientStructure from "./structures/client_structures/ZoneClientStructure";
import GoToActions from "./actions/live_map_actions/GoToActions";
import {TapTouchHandlerEvent} from "./utils/touch_handling/events/TapTouchHandlerEvent";

interface LiveMapProps extends MapProps {
    supportedCapabilities: {
        [Capability.MapSegmentation]: boolean,
        [Capability.ZoneCleaning]: boolean,
        [Capability.GoToLocation]: boolean,
        [Capability.Locate]: boolean
    }
}

interface LiveMapState extends MapState {
    zones: Array<ZoneClientStructure>,
    goToTarget: GoToTargetClientStructure | undefined
}

class LiveMap extends Map<LiveMapProps, LiveMapState> {
    constructor(props: LiveMapProps) {
        super(props);

        this.state = {
            selectedSegmentIds: [],
            zones: [],
            goToTarget: undefined
        };
    }

    protected updateState() : void {
        super.updateState();

        this.setState({
            zones: this.structureManager.getClientStructures().filter(s => {
                return s.type === ZoneClientStructure.TYPE;
            }) as Array<ZoneClientStructure>,
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

        if (this.props.supportedCapabilities[Capability.GoToLocation]) {
            if (
                this.structureManager.getClientStructures().filter(s => {
                    return s.type !== GoToTargetClientStructure.TYPE;
                }).length === 0 &&
                this.state.selectedSegmentIds.length === 0 &&
                evt.duration >= TapTouchHandlerEvent.LONG_PRESS_DURATION
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
        }

        if (
            this.state.zones.length === 0 &&
            this.state.goToTarget === undefined
        ) {
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

    protected renderAdditionalElements(): JSX.Element {
        return <>
            {
                this.props.supportedCapabilities[Capability.Locate] &&
                <LocateAction/>
            }

            <ActionsContainer>
                {
                    this.props.supportedCapabilities[Capability.MapSegmentation] &&
                    this.state.selectedSegmentIds.length > 0 &&
                    this.state.goToTarget === undefined &&

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
                    this.props.supportedCapabilities[Capability.ZoneCleaning] &&
                    this.state.selectedSegmentIds.length === 0 &&
                    this.state.goToTarget === undefined &&

                    <ZoneActions
                        zones={this.state.zones}
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
                    this.props.supportedCapabilities[Capability.GoToLocation] &&
                    this.state.goToTarget !== undefined &&

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
        </>;
    }
}

export default LiveMap;
