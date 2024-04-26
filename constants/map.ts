import type { Vector2d } from "konva/lib/types";

const MAP = {
    /**
     * Customs
     */
    CUSTOMS: "customs",
    /**
     * Factory
     */
    FACTORY: "factory",
    /**
     * Ground Zero
     */
    GROUND_ZERO: "ground-zero",
    /**
     * Interchange
     */
    INTERCHANGE: "interchange",
    /**
     * Labs
     */
    LABS: "labs",
    /**
     * Lighthouse
     */
    LIGHTHOUSE: "lighthouse",
    /**
     * Reserve
     */
    RESERVE: "reserve",
    /**
     * Shoreline
     */
    SHORELINE: "shoreline",
    /**
     * Streets of Tarkov
     */
    STREETS_OF_TARKOV: "streets-of-tarkov",
    /**
     * Woods
     */
    WOODS: "woods",
} as const;

export type Map = (typeof MAP)[keyof typeof MAP];

export const MAPS = Object.values(MAP);

export interface Vector3d {
    x: number;
    y: number;
    z: number;
}

export interface ScreenshotVector3d extends Vector3d {
    name: string;
}

export interface Vector2dWithId extends Vector2d {
    id: string;
}

export interface MapPosition {
    id: string;
    imageFrom: Vector2d;
    imageTo: Vector2d;
    gameFrom: Vector3d;
    gameTo: Vector3d;
}

export interface MapConfig {
    enable: boolean;
    image: string;
    width: number;
    height: number;
    positions: MapPosition[];
}

export const MAP_CONFING = {
    [MAP.CUSTOMS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/customs.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.FACTORY]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/factory.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.GROUND_ZERO]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/ground-zero.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.INTERCHANGE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/interchange.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.LABS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/labs.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.LIGHTHOUSE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/lighthouse.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.RESERVE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/reserve.webp",
        width: 0,
        height: 0,
        positions: [],
    },
    [MAP.SHORELINE]: {
        enable: true,
        image: "/tarkov-live-map/images/maps/shoreline.webp",
        width: 6668,
        height: 4567,
        positions: [
            {
                id: "main",
                imageFrom: { x: 144, y: 1150 },
                imageTo: { x: 5350, y: 4423 },
                gameFrom: { x: 490, y: -415, z: -1000 },
                gameTo: { x: -1040, y: 580, z: 1000 },
            },
            {
                id: "admin_1st_floor",
                imageFrom: { x: 4141, y: 113 },
                imageTo: { x: 4705, y: 581 },
                gameFrom: { x: -229, y: -165, z: -3 },
                gameTo: { x: -274, y: -129, z: 1.8 },
            },
        ],
    },
    [MAP.STREETS_OF_TARKOV]: {
        enable: true,
        image: "/tarkov-live-map/images/maps/streets-of-tarkov.webp",
        width: 7620,
        height: 5877,
        positions: [
            {
                id: "main",
                imageFrom: { x: 2265, y: 338 },
                imageTo: { x: 5840, y: 5334 },
                gameFrom: { x: 315, y: -283, z: -1000 },
                gameTo: { x: -268, y: 528, z: 1000 },
            },
        ],
    },
    [MAP.WOODS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/woods.webp",
        width: 0,
        height: 0,
        positions: [],
    },
} satisfies Record<Map, MapConfig>;
