import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from "react";
import { Circle, Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

import { MAP_CONFING } from "@/constants/map";

import { vector3dToVector2dList } from "@/lib/tarkov";

import type { KonvaEventObject } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import type { Map as MapType, Vector3d } from "@/constants/map";
import type { Stage as StageType } from "konva/lib/Stage";

const MapStage = ({ map, myPositions }: { map: MapType; myPositions: Vector3d[] }) => {
    const [mapImage] = useImage(MAP_CONFING[map].image);

    const [stageScale, setStageScale] = useState<Vector2d>({ x: 1, y: 1 });
    const [stageWidth, setStageWidth] = useState<number>(window.innerWidth);
    const [stageHeight, setStageHeight] = useState<number>(window.innerHeight);

    const stageRef = useRef<StageType>(null);

    useEffect(() => {
        const handleResize = () => {
            setStageWidth(window.innerWidth);
            setStageHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    useEffect(() => {
        if (mapImage) {
            const scale = Math.max(window.innerWidth / mapImage.width, 0.1);

            setStageScale({
                x: scale,
                y: scale,
            });
        }
    }, [mapImage]);

    const limitStagePosition = useCallback(() => {
        if (stageRef.current === null || !mapImage) {
            return;
        }

        // Limit the stage position depending on the scale and the image size
        const stage = stageRef.current;
        const scale = stage.scaleX();
        const stageSize = stage.getSize();
        const width = stageSize.width;
        const height = stageSize.height;
        const imageWidth = mapImage.width + (width * 0.9) / scale;
        const imageHeight = mapImage.height + (height * 0.9) / scale;

        const maxPositionX = Math.max(0, width * 0.9);
        const maxPositionY = Math.max(0, height * 0.9);

        const newStagePosition = { x: stage.x(), y: stage.y() };

        // Limit the stage position to the image size
        if (imageWidth * scale > width) {
            newStagePosition.x = Math.min(maxPositionX, Math.max(width - imageWidth * scale, newStagePosition.x));
        } else {
            newStagePosition.x = 0;
        }

        if (imageHeight * scale > height) {
            newStagePosition.y = Math.min(maxPositionY, Math.max(height - imageHeight * scale, newStagePosition.y));
        } else {
            newStagePosition.y = 0;
        }

        stage.position(newStagePosition);
    }, [mapImage]);

    const onDragMove = useCallback(
        (event: KonvaEventObject<DragEvent>) => {
            event.evt.preventDefault();

            limitStagePosition();
        },
        [limitStagePosition]
    );

    const onWheelEvent = useCallback(
        (event: KonvaEventObject<WheelEvent>) => {
            event.evt.preventDefault();

            if (stageRef.current === null || !mapImage) {
                return;
            }

            const stage = stageRef.current;
            const minScale = Math.max(window.innerWidth / mapImage.width, 0.1);
            const pointer = stage.getPointerPosition();
            const scale = stage.scaleX();

            if (pointer === null) {
                return;
            }

            const mousePointTo = {
                x: (pointer.x - stage.x()) / scale,
                y: (pointer.y - stage.y()) / scale,
            };

            // detect Zoom in or zoom out
            const direction = event.evt.deltaY > 0 ? -1 : 1;

            const newScale = Math.min(Math.max(direction > 0 ? scale * 1.1 : scale / 1.1, minScale), 1);

            setStageScale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            stage.position(newPos);
        },
        [mapImage]
    );

    const myMapPositions = useMemo(() => {
        return myPositions
            .map(position => vector3dToVector2dList(map, position))
            .filter(vectors => vectors.length !== 0);
    }, [map, myPositions]);

    console.log(myMapPositions[0]);

    return (
        <Stage
            width={stageWidth}
            height={stageHeight}
            scale={stageScale}
            draggable
            onDragMove={onDragMove}
            onWheel={onWheelEvent}
            onMouseDown={() => {
                console.log(stageRef.current?.getRelativePointerPosition());
            }}
            ref={stageRef}
        >
            <Layer>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image image={mapImage} />
            </Layer>
            <Layer>
                {myMapPositions.map((positions, index) => (
                    <Fragment key={`my-positions-${positions[0].id}-${positions[0].x}-${positions[0].y}-${index}`}>
                        {positions.map(position => (
                            <Circle
                                key={`my-${position.id}-${position.x}-${position.y}-${index}`}
                                x={position.x}
                                y={position.y}
                                radius={5 / stageScale.x}
                                // fill will be transparent by 10%
                                fill={`rgba(255, 0, 0, ${Math.max(0, 1 - index * 0.1)})`}
                                shadowBlur={10}
                            />
                        ))}
                    </Fragment>
                ))}
            </Layer>
        </Stage>
    );
};

export default MapStage;
