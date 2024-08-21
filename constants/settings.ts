export interface Settings {
    markerColor: string;
    markerSize: number;
    markerAnimation: boolean;
    screenshotAutoDelete: boolean;
}

export const DEFAULT_SETTINGS = {
    markerColor: "#ff0000",
    markerSize: 5,
    markerAnimation: true,
    screenshotAutoDelete: true,
} satisfies Settings;
