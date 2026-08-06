const CapabilityRouter = require("./CapabilityRouter");

class EdgeCleaningCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.put("/", this.validator, async (req, res) => {
            const body = req.body || {};
            const action = body.action;
            const rawSegmentIds = body.segment_ids || body.segmentIds;

            if (Array.isArray(rawSegmentIds) && rawSegmentIds.length > 0) {
                return res.status(400).json("segment_ids are not supported by edge cleaning");
            }

            if (action === "clean" || action === "start") {
                try {
                    await this.capability.start();
                    res.sendStatus(200);
                } catch (e) {
                    this.sendErrorResponse(req, res, e);
                }
            } else {
                res.sendStatus(400);
            }
        });
    }
}

module.exports = EdgeCleaningCapabilityRouter;
