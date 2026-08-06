export type MapMeasurementConfig = {
    cmPerMapUnit: number | null,
    segmentAreaMultiplier: number
};

const DEFAULT_MAP_MEASUREMENT_CONFIG: MapMeasurementConfig = {
    cmPerMapUnit: null,
    segmentAreaMultiplier: 1
};

let config: MapMeasurementConfig = DEFAULT_MAP_MEASUREMENT_CONFIG;
let loading = false;
let loaded = false;

function normalizePositiveNumber(value: unknown): number | undefined {
    const numberValue = Number(value);

    return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : undefined;
}

function loadMapMeasurementConfig(): void {
    if (loading || loaded || typeof fetch !== "function") {
        return;
    }

    loading = true;

    fetch("./api/v2/valetudo/config/congatudo")
        .then(response => response.ok ? response.json() : undefined)
        .then(responseConfig => {
            const zoneMeasurement = responseConfig?.zoneMeasurement ?? {};
            const cmPerMapUnit = normalizePositiveNumber(zoneMeasurement.cmPerMapUnit);
            const segmentAreaMultiplier = normalizePositiveNumber(zoneMeasurement.segmentAreaMultiplier);

            config = {
                cmPerMapUnit: cmPerMapUnit ?? null,
                segmentAreaMultiplier: segmentAreaMultiplier ?? DEFAULT_MAP_MEASUREMENT_CONFIG.segmentAreaMultiplier
            };
        })
        .catch(() => undefined)
        .then(() => {
            loaded = true;
            loading = false;
        });
}

export function getEffectiveCmPerMapUnit(pixelSize: number): number {
    loadMapMeasurementConfig();

    return config.cmPerMapUnit ?? pixelSize;
}

export function getSegmentAreaMultiplier(): number {
    loadMapMeasurementConfig();

    return config.segmentAreaMultiplier;
}
