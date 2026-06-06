import React from "react";
import {Box, CircularProgress, Container, Grid, Typography} from "@mui/material";
import {ActionButton} from "../../Styled";
import IntegrationHelpDialog from "../../../components/IntegrationHelpDialog";
import {useLongPress} from "use-long-press";
import {useRobotStatusQuery} from "../../../api";
import {Polyline as EdgeIcon} from "@mui/icons-material";

const EDGE_CLEANING_ENDPOINT = "/api/v2/robot/capabilities/EdgeCleaningCapability";
const EDGE_CLEANING_PAYLOAD = {
    action: "clean"
};

const EdgeActions = (): React.ReactElement => {
    const [edgeCleanIsExecuting, setEdgeCleanIsExecuting] = React.useState(false);
    const [edgeCleanError, setEdgeCleanError] = React.useState<string | undefined>(undefined);
    const [integrationHelpDialogOpen, setIntegrationHelpDialogOpen] = React.useState(false);

    const {data: status} = useRobotStatusQuery((state) => {
        return state.value;
    });

    const canClean = status === "idle" || status === "docked" || status === "paused" || status === "returning" || status === "error";

    const handleClick = React.useCallback(() => {
        if (!canClean || edgeCleanIsExecuting) {
            return;
        }

        setEdgeCleanError(undefined);
        setEdgeCleanIsExecuting(true);

        fetch(EDGE_CLEANING_ENDPOINT, {
            method: "PUT",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(EDGE_CLEANING_PAYLOAD)
        }).then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
        }).catch(err => {
            const message = err instanceof Error ? err.message : String(err);

            setEdgeCleanError(message);
        }).finally(() => {
            setEdgeCleanIsExecuting(false);
        });
    }, [canClean, edgeCleanIsExecuting]);

    const handleLongClick = React.useCallback(() => {
        setIntegrationHelpDialogOpen(true);
    }, []);

    const setupClickHandlers = useLongPress(
        handleLongClick,
        {
            onCancel: () => {
                handleClick();
            },
            threshold: 500,
            captureEvent: true,
            cancelOnMovement: true,
        }
    );

    return (
        <>
            <Grid container spacing={1} direction="row-reverse" flexWrap="wrap-reverse">
                <Grid item>
                    <ActionButton
                        disabled={edgeCleanIsExecuting || !canClean}
                        color="inherit"
                        size="medium"
                        variant="extended"
                        {...setupClickHandlers()}
                    >
                        <EdgeIcon style={{marginRight: "0.25rem", marginLeft: "-0.25rem"}}/>
                        Edge
                        {edgeCleanIsExecuting && (
                            <CircularProgress
                                color="inherit"
                                size={18}
                                style={{marginLeft: 10}}
                            />
                        )}
                    </ActionButton>
                </Grid>
                {
                    !canClean &&
                    <Grid item>
                        <Typography variant="caption" color="textSecondary">
                            Cannot start edge cleaning while the robot is busy
                        </Typography>
                    </Grid>
                }
                {
                    edgeCleanError !== undefined &&
                    <Grid item>
                        <Typography variant="caption" color="error">
                            {edgeCleanError}
                        </Typography>
                    </Grid>
                }
            </Grid>
            <Box m={1}/>
            <Container>
                <Typography variant="caption" color="textSecondary">
                    Starts edge/follow-wall cleaning for the whole house.
                </Typography>
            </Container>
            <IntegrationHelpDialog
                dialogOpen={integrationHelpDialogOpen}
                setDialogOpen={(open: boolean) => {
                    setIntegrationHelpDialogOpen(open);
                }}
                coordinatesWarning={false}
                helperText={"To start edge cleaning via REST, use this payload on /api/v2/robot/capabilities/EdgeCleaningCapability."}
                payload={JSON.stringify(EDGE_CLEANING_PAYLOAD, null, 2)}
            />
        </>
    );
};

export default EdgeActions;
