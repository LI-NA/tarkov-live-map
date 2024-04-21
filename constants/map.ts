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

export const MAP_TITLE = {
    [MAP.CUSTOMS]: "Customs",
    [MAP.FACTORY]: "Factory",
    [MAP.GROUND_ZERO]: "Ground Zero",
    [MAP.INTERCHANGE]: "Interchange",
    [MAP.LABS]: "Labs",
    [MAP.LIGHTHOUSE]: "Lighthouse",
    [MAP.RESERVE]: "Reserve",
    [MAP.SHORELINE]: "Shoreline",
    [MAP.STREETS_OF_TARKOV]: "Streets of Tarkov",
    [MAP.WOODS]: "Woods",
} as const;

export const MAP_CONFING = {
    [MAP.CUSTOMS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/customs.webp",
    },
    [MAP.FACTORY]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/factory.webp",
    },
    [MAP.GROUND_ZERO]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/ground-zero.webp",
    },
    [MAP.INTERCHANGE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/interchange.webp",
    },
    [MAP.LABS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/labs.webp",
    },
    [MAP.LIGHTHOUSE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/lighthouse.webp",
    },
    [MAP.RESERVE]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/reserve.webp",
    },
    [MAP.SHORELINE]: {
        enable: true,
        image: "/tarkov-live-map/images/maps/shoreline.webp",
    },
    [MAP.STREETS_OF_TARKOV]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/streets-of-tarkov.webp",
    },
    [MAP.WOODS]: {
        enable: false,
        image: "/tarkov-live-map/images/maps/woods.webp",
    },
} as const;
