import { MAP_CONFING } from "@/constants/map";

import type { Map, MapPosition, Vector2dWithId, Vector3d } from "@/constants/map";

/**
 * Convert screenshot name to Vector3d
 */
export const screenshotToVector3d = (screenshot: string): Vector3d | null => {
    try {
        const [, position] = screenshot.split("_");
        const [x, z, y] = position.split(",").map(parseFloat);

        return { x, y, z };
    } catch (error) {
        // File name is not a screenshot.
        return null;
    }
};

/**
 * Check the Vector3d is in the range of Vector3d
 */
export const isVector3dInRange = (from: Vector3d, to: Vector3d, vector: Vector3d): boolean => {
    // Make support both case from > to and to > from.
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);

    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);

    const minZ = Math.min(from.z, to.z);
    const maxZ = Math.max(from.z, to.z);

    return (
        minX <= vector.x &&
        vector.x <= maxX &&
        minY <= vector.y &&
        vector.y <= maxY &&
        minZ <= vector.z &&
        vector.z <= maxZ
    );
};

/**
 * Convert the game Vector3d to the Map Vector2d using the position
 */
export const vector3dToVector2d = (position: MapPosition, vector: Vector3d): Vector2dWithId => {
    const { id, gameFrom, gameTo, imageFrom, imageTo } = position;

    const x = ((vector.x - gameFrom.x) / (gameTo.x - gameFrom.x)) * (imageTo.x - imageFrom.x) + imageFrom.x;
    const y = ((vector.y - gameFrom.y) / (gameTo.y - gameFrom.y)) * (imageTo.y - imageFrom.y) + imageFrom.y;

    return { id, x, y };
};

/**
 * Convert the game Vector3d to the Map Vector2d using the map
 */
export const vector3dToVector2dList = (map: Map, vector: Vector3d): Vector2dWithId[] => {
    const mapPositions = MAP_CONFING[map].positions;

    console.log("mapPositions", mapPositions, vector.x, vector.y, vector.z);

    // Find the first position that the vector is in.
    const matchedPositions = mapPositions.filter(({ gameFrom, gameTo }) => isVector3dInRange(gameFrom, gameTo, vector));

    console.log("matchedPositions", matchedPositions);

    if (matchedPositions.length === 0) {
        return [];
    }

    return matchedPositions.map(position => vector3dToVector2d(position, vector));
};
