"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MapStage = dynamic(() => import("@/components/map-stage"), {
    ssr: false,
});

import type { Map } from "@/constants/map";

export default function Home({
    params: { map },
}: {
    params: {
        map: Map;
    };
}) {
    const [initDialogOpen, setInitDialogOpen] = useState(false);

    const onClickInitDialogAction = useCallback(() => {}, []);

    const onClickInitDialogClose = useCallback(() => {
        setInitDialogOpen(false);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setInitDialogOpen(true);
        }
    }, []);

    return (
        <>
            <MapStage map={map} />
            <AlertDialog open={initDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Please select tarkov screenshot folder.</AlertDialogTitle>
                        <AlertDialogDescription>
                            <p>
                                You need to specify your own folder for Tarkov&apos;s screenshots for the real-time
                                location display feature. If you don&apos;t want to specify a screenshot folder and just
                                want to see your friend&apos;s location, press Close this dialog.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={onClickInitDialogAction}>Select the folder</AlertDialogAction>
                        <AlertDialogCancel onClick={onClickInitDialogClose}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
