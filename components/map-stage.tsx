import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from "react";
import { Animation } from "konva/lib/Animation";
import { Circle, Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

import { MAP_CONFING } from "@/constants/map";

import { vector3dToVector2dList } from "@/lib/tarkov";

import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage as StageType } from "konva/lib/Stage";
import type { Layer as LayerType } from "konva/lib/Layer";
import type { Circle as CircleType } from "konva/lib/shapes/Circle";
import type { Map as MapType, ScreenshotVector3d } from "@/constants/map";

const MIN_SCALE = 0.05;

const MapStage = ({ map, myPositions }: { map: MapType; myPositions: ScreenshotVector3d[] }) => {
    const [mapImage] = useImage(MAP_CONFING[map].image);

    const [stageScale, setStageScale] = useState<number>(1);
    const [stageWidth, setStageWidth] = useState<number>(window.innerWidth);
    const [stageHeight, setStageHeight] = useState<number>(window.innerHeight);

    const stageRef = useRef<StageType>(null);
    const animationRef = useRef<Animation | null>(null);
    const animationLayerRef = useRef<LayerType>(null);
    const animationCircleRef = useRef<CircleType>(null);

    useEffect(() => {
        const handleResize = () => {
            setStageWidth(window.innerWidth);
            setStageHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (animationLayerRef.current && !animationRef.current) {
            animationRef.current = new Animation(frame => {
                if (!animationCircleRef.current || !frame) {
                    return;
                }

                const x = (frame.time % 2000) / 2000;
                const easeOutExpo = x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
                const easeOutCubic = 1 - Math.pow(1 - x, 3);
                const scale = 1 + easeOutExpo * 3;
                const opacity = 1 - easeOutCubic;

                animationCircleRef.current.scale({ x: scale, y: scale });
                animationCircleRef.current.opacity(opacity);
            }, animationLayerRef.current);
        }

        if (animationRef.current) {
            animationRef.current.start();
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (mapImage && stageRef.current) {
            const scale = Math.max(window.innerWidth / mapImage.width, MIN_SCALE);

            setStageScale(scale);

            stageRef.current.scale({ x: scale, y: scale });
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
            const minScale = Math.max(
                Math.min(window.innerWidth / mapImage.width, window.innerHeight / mapImage.height),
                MIN_SCALE
            );
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

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            stage.position(newPos);
            stage.scale({ x: newScale, y: newScale });

            setStageScale(newScale);
        },
        [mapImage]
    );

    const myMapPositions = useMemo(() => {
        const mapPositions = myPositions
            .map(position => ({
                name: position.name,
                vectors: vector3dToVector2dList(map, position),
            }))
            .filter(({ vectors }) => vectors.length !== 0);

        return mapPositions;
    }, [map, myPositions]);

    console.log(myMapPositions[0]);

    return (
        <Stage
            width={stageWidth}
            height={stageHeight}
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
                {myMapPositions.map((position, index) => (
                    <Fragment key={`my-positions-${position.name}`}>
                        {position.vectors.map(vector => (
                            <Circle
                                key={`my-${vector.id}-${vector.x}-${vector.y}-${index}`}
                                x={vector.x}
                                y={vector.y}
                                radius={5 / stageScale}
                                fill="red"
                                stroke="black"
                                opacity={1 - index * 0.1}
                                shadowBlur={10}
                            />
                        ))}
                    </Fragment>
                ))}
            </Layer>
            <Layer ref={animationLayerRef}>
                {myMapPositions.length > 0 && (
                    <Circle
                        x={myMapPositions[0].vectors[0].x}
                        y={myMapPositions[0].vectors[0].y}
                        radius={5 / stageScale}
                        fill="transparent"
                        stroke="white"
                        strokeWidth={0.5 / stageScale}
                        shadowBlur={10}
                        shadowColor="white"
                        ref={animationCircleRef}
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default MapStage;
