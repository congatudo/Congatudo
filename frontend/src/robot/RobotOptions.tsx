import {useCapabilitiesSupported} from "../CapabilitiesProvider";
import {
    Capability,
    useAutoEmptyDockAutoEmptyControlMutation,
    useAutoEmptyDockAutoEmptyControlQuery,
    useCarpetModeStateMutation,
    useCarpetModeStateQuery,
    useKeyLockStateMutation,
    useKeyLockStateQuery,
    useLocateMutation,
} from "../api";
import React from "react";
import {ListMenu} from "../components/list_menu/ListMenu";
import {ToggleSwitchListMenuItem} from "../components/list_menu/ToggleSwitchListMenuItem";
import {
    NotListedLocation as LocateIcon,
    Lock as KeyLockIcon,
    Sensors as CarpetModeIcon,
    AutoDelete as AutoEmptyControlIcon,
    MiscellaneousServices as MiscIcon,
    Star as QuirksIcon
} from "@mui/icons-material";
import {SpacerListMenuItem} from "../components/list_menu/SpacerListMenuItem";
import {LinkListMenuItem} from "../components/list_menu/LinkListMenuItem";
import PaperContainer from "../components/PaperContainer";
import { ButtonListMenuItem } from "../components/list_menu/ButtonListMenuItem";

const LocateButtonListMenuItem = (): React.ReactElement => {
    const {
        mutate: locate,
        isPending: locateIsExecuting
    } = useLocateMutation();

    return (
        <ButtonListMenuItem
            primaryLabel="Locate Robot"
            secondaryLabel="The robot will play a sound to announce its location"
            icon={<LocateIcon/>}
            buttonLabel="Go"
            action={() => {
                locate();
            }}
            actionLoading={locateIsExecuting}
        />
    );
};

const KeyLockCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = useKeyLockStateQuery();

    const {mutate: mutate, isPending: isChanging} = useKeyLockStateMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Lock keys"}
            secondaryLabel={"Prevents the robot from being operated using its physical buttons."}
            icon={<KeyLockIcon/>}
        />
    );
};

const CarpetModeControlCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = useCarpetModeStateQuery();

    const {mutate: mutate, isPending: isChanging} = useCarpetModeStateMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Carpet Mode"}
            secondaryLabel={"When enabled, the vacuum will recognize carpets automatically and increase the suction."}
            icon={<CarpetModeIcon/>}
        />
    );
};

<<<<<<< HEAD
=======
const CarpetSensorModeControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "off": 3,
        "avoid": 2,
        "lift": 1
    };

    const {
        data: carpetSensorModeProperties,
        isPending: carpetSensorModePropertiesPending,
        isError: carpetSensorModePropertiesError
    } = useCarpetSensorModePropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        carpetSensorModeProperties?.supportedModes ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: CarpetSensorMode) => {
        let label;

        switch (val) {
            case "off":
                label = "None";
                break;
            case "avoid":
                label = "Avoid Carpet";
                break;
            case "lift":
                label = "Lift Mop";
                break;
        }

        return {
            value: val,
            label: label
        };
    });


    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useCarpetSensorModeQuery();

    const {mutate: mutate, isPending: isChanging} = useCarpetSensorModeMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};


    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as CarpetSensorMode);
            }}
            disabled={disabled}
            loadingOptions={carpetSensorModePropertiesPending || isPending}
            loadError={carpetSensorModePropertiesError}
            primaryLabel="Carpet Sensor"
            secondaryLabel="Select what action the robot should take if it detects carpet while mopping."
            icon={<CarpetSensorModeIcon/>}
        />
    );
};

>>>>>>> 5a364efd (refactor: Bump all dependencies to latest versions + minor code cleanup)
const AutoEmptyDockAutoEmptyControlCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = useAutoEmptyDockAutoEmptyControlQuery();

    const {mutate: mutate, isPending: isChanging} = useAutoEmptyDockAutoEmptyControlMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Auto-Empty Dock"}
            secondaryLabel={"Enables automatic emptying of the robot into the dock. The interval between empties is robot-specific."}
            icon={<AutoEmptyControlIcon/>}
        />
    );
};

<<<<<<< HEAD
=======
const ObstacleAvoidanceControlCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = useObstacleAvoidanceControlQuery();

    const {mutate: mutate, isPending: isChanging} = useObstacleAvoidanceControlMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Obstacle Avoidance"}
            secondaryLabel={"Avoid obstacles using sensors such as lasers or cameras. May suffer from false positives."}
            icon={<ObstacleAvoidanceControlIcon/>}
        />
    );
};

const PetObstacleAvoidanceControlCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = usePetObstacleAvoidanceControlQuery();

    const {mutate: mutate, isPending: isChanging} = usePetObstacleAvoidanceControlMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Pet Obstacle Avoidance"}
            secondaryLabel={"Fine-tune obstacle avoidance to avoid obstacles left by pets. Will increase the general false positive rate."}
            icon={<PetObstacleAvoidanceControlIcon/>}
        />
    );
};

const CollisionAvoidantNavigationControlCapabilitySwitchListMenuItem = () => {
    const {
        data: data,
        isFetching: isFetching,
        isError: isError,
    } = useCollisionAvoidantNavigationControlQuery();

    const {mutate: mutate, isPending: isChanging} = useCollisionAvoidantNavigationControlMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => {
                mutate(value);
            }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={"Collision-avoidant Navigation"}
            secondaryLabel={"Drive a more conservative route to reduce collisions. May cause missed spots."}
            icon={<CollisionAvoidantNavigationControlIcon/>}
        />
    );
};

>>>>>>> 5a364efd (refactor: Bump all dependencies to latest versions + minor code cleanup)

const RobotOptions = (): React.ReactElement => {
    const [
        locateCapabilitySupported,

        keyLockControlCapabilitySupported,
        carpetModeControlCapabilitySupported,
        autoEmptyDockAutoEmptyControlCapabilitySupported,

        speakerVolumeControlCapabilitySupported,
        speakerTestCapabilitySupported,
        voicePackManagementCapabilitySupported,
        doNotDisturbCapabilitySupported,

        quirksCapabilitySupported,
    ] = useCapabilitiesSupported(
        Capability.Locate,

        Capability.KeyLock,
        Capability.CarpetModeControl,
        Capability.AutoEmptyDockAutoEmptyControl,

        Capability.SpeakerVolumeControl,
        Capability.SpeakerTest,
        Capability.VoicePackManagement,
        Capability.DoNotDisturb,

        Capability.Quirks
    );

    const listItems = React.useMemo(() => {
        const items = [];

        if (locateCapabilitySupported) {
            items.push(<LocateButtonListMenuItem key={"locateAction"}/>);

            items.push(<SpacerListMenuItem key={"spacer0"}/>);
        }


        if (keyLockControlCapabilitySupported) {
            items.push(
                <KeyLockCapabilitySwitchListMenuItem key={"keyLockControl"}/>
            );
        }

        if (carpetModeControlCapabilitySupported) {
            items.push(
                <CarpetModeControlCapabilitySwitchListMenuItem key={"carpetModeControl"}/>
            );
        }

        if (autoEmptyDockAutoEmptyControlCapabilitySupported) {
            items.push(
                <AutoEmptyDockAutoEmptyControlCapabilitySwitchListMenuItem key={"autoEmptyControl"}/>
            );
        }

        if (
            speakerVolumeControlCapabilitySupported || speakerTestCapabilitySupported ||
            voicePackManagementCapabilitySupported ||
            doNotDisturbCapabilitySupported ||
            quirksCapabilitySupported
        ) {
            if (items.length > 0) {
                items.push(<SpacerListMenuItem key={"spacer1"}/>);
            }

            if (
                (speakerVolumeControlCapabilitySupported && speakerTestCapabilitySupported) ||
                voicePackManagementCapabilitySupported ||
                doNotDisturbCapabilitySupported
            ) {
                const label = [];

                if (voicePackManagementCapabilitySupported) {
                    label.push("Voice packs");
                }

                if (doNotDisturbCapabilitySupported) {
                    label.push("Do not disturb");
                }

                if (speakerVolumeControlCapabilitySupported && speakerTestCapabilitySupported) {
                    label.push("Speaker settings");
                }

                items.push(
                    <LinkListMenuItem
                        key="miscRobotSettings"
                        url="/options/robot/misc"
                        primaryLabel="Misc Options"
                        secondaryLabel={label.join(", ")}
                        icon={<MiscIcon/>}
                    />
                );
            }

            if (quirksCapabilitySupported) {
                items.push(
                    <LinkListMenuItem
                        key="quirks"
                        url="/options/robot/quirks"
                        primaryLabel="Quirks"
                        secondaryLabel="Configure firmware-specific quirks"
                        icon={<QuirksIcon/>}
                    />
                );
            }


        }

        return items;
    }, [
        locateCapabilitySupported,

        keyLockControlCapabilitySupported,
        carpetModeControlCapabilitySupported,
        autoEmptyDockAutoEmptyControlCapabilitySupported,

        speakerVolumeControlCapabilitySupported,
        speakerTestCapabilitySupported,
        voicePackManagementCapabilitySupported,
        doNotDisturbCapabilitySupported,

        quirksCapabilitySupported,
    ]);

<<<<<<< HEAD
=======
    const listItems = React.useMemo(() => {
        const items: Array<React.ReactElement> = [];

        items.push(...actionListItems);

        if (behaviorListItems.length > 0) {
            items.push(<SpacerListMenuItem key={"spacer0"}/>);
        }
        items.push(...behaviorListItems);

        if (dockListItems.length > 0) {
            items.push(<SpacerListMenuItem key={"spacer1"}/>);
        }
        items.push(...dockListItems);

        if (miscListItems.length > 0) {
            items.push(<SpacerListMenuItem key={"spacer2"}/>);
        }
        items.push(...miscListItems);

        if (submenuListItems.length > 0) {
            items.push(<SpacerListMenuItem key={"spacer3"}/>);
        }
        items.push(...submenuListItems);


        return items;
    }, [
        actionListItems,
        behaviorListItems,
        dockListItems,
        miscListItems,
        submenuListItems
    ]);

>>>>>>> 5a364efd (refactor: Bump all dependencies to latest versions + minor code cleanup)
    return (
        <PaperContainer>
            <ListMenu
                primaryHeader={"Robot Options"}
                secondaryHeader={"Tunables and actions provided by the robot's firmware"}
                listItems={listItems}
            />
        </PaperContainer>
    );
};

export default RobotOptions;
