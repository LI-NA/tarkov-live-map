import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { MAPS } from "@/constants/map";

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

import type { GetStaticPaths, GetStaticProps } from "next";
import type { Map } from "@/constants/map";

export const getStaticPaths = (async () => {
    return {
        paths: MAPS.map(map => ({ params: { map } })),
        fallback: false,
    };
}) satisfies GetStaticPaths;

export const getStaticProps = (async () => {
    return { props: {} };
}) satisfies GetStaticProps;

const MapStage = dynamic(() => import("@/components/map-stage"), {
    ssr: false,
});

export default function MapIndex() {
    const router = useRouter();
    const map = router.query.map as Map;

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
