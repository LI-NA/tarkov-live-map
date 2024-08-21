import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { MAPS } from "@/constants/map";
import { DEFAULT_SETTINGS } from "@/constants/settings";

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
import { useToast } from "@/components/ui/use-toast";
import MapMenu from "@/components/map-menu";

import { mergeI18nPaths, makeStaticProps } from "@/lib/getStatic";
import { getQueryWithoutUndefined } from "@/lib/query";
import { screenshotToVector3d } from "@/lib/tarkov";

import type { GetStaticPaths } from "next";
import type { Map, ScreenshotVector3d } from "@/constants/map";
import type { Settings } from "@/constants/settings";

export const getStaticPaths = (() => {
    const mapPaths = MAPS.map(map => ({ params: { map } }));
    const paths = mergeI18nPaths(mapPaths);

    return {
        paths,
        fallback: false,
    };
}) satisfies GetStaticPaths;

export const getStaticProps = makeStaticProps(["common"]);

const MapStage = dynamic(() => import("@/components/map-stage"), {
    ssr: false,
});

export default function MapIndex() {
    const router = useRouter();
    const { t } = useTranslation("common");
    const { toast } = useToast();

    const map = getQueryWithoutUndefined<Map>(router.query.map);

    const [initDialogOpen, setInitDialogOpen] = useState(false);
    const [directoryStatus, setDirectoryStatus] = useState(false);
    const [screenshotVectors, setScreenshotVectors] = useState<ScreenshotVector3d[]>([]);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    const ignoreFilesRef = useRef<Set<string>>(new Set<string>());
    const directoryHandleRef = useRef<FileSystemDirectoryHandle | null>(null);
    const directoryScanIntervalRef = useRef<number | null>(null);
    const settingsRef = useRef<Settings>(settings);

    const onClickInitDialogAction = useCallback(async () => {
        try {
            const dirHandle = await window.showDirectoryPicker({
                startIn: "documents",
            });

            if (
                (await dirHandle.queryPermission({ mode: "readwrite" })) === "granted" ||
                (await dirHandle.requestPermission({ mode: "readwrite" })) === "granted"
            ) {
                // Read and write access has been granted.

                for await (const handle of dirHandle.values()) {
                    if (handle.kind === "file") {
                        ignoreFilesRef.current.add(handle.name);
                    }
                }

                directoryHandleRef.current = dirHandle;
                setDirectoryStatus(true);
                setInitDialogOpen(false);
            } else {
                // The user didn't grant permission.
                toast({
                    variant: "destructive",
                    title: t("map.initDialog.toast.permissionDenied.title"),
                    description: t("map.initDialog.toast.permissionDenied.description"),
                });
            }
        } catch (error) {
            console.error(error);

            toast({
                variant: "destructive",
                title: t("map.initDialog.toast.permissionDenied.title"),
                description: t("map.initDialog.toast.permissionDenied.description"),
            });
        }
    }, [t, toast]);

    const onClickInitDialogClose = useCallback(() => {
        setInitDialogOpen(false);
    }, []);

    const scanDirectory = useCallback(async () => {
        if (!directoryHandleRef.current) {
            return;
        }

        const dirHandle = directoryHandleRef.current;
        const files: ScreenshotVector3d[] = [];

        try {
            for await (const handle of dirHandle.values()) {
                if (handle.kind === "file" && !ignoreFilesRef.current.has(handle.name)) {
                    const vector = screenshotToVector3d(handle.name);

                    if (vector) {
                        files.push({
                            ...vector,
                            name: handle.name,
                        });
                        console.log({
                            ...vector,
                            name: handle.name,
                        });

                        if (settingsRef.current.screenshotAutoDelete) {
                            await dirHandle.removeEntry(handle.name);
                        } else {
                            ignoreFilesRef.current.add(handle.name);
                        }
                    } else {
                        ignoreFilesRef.current.add(handle.name);
                    }
                }
            }

            if (files.length > 0) {
                setScreenshotVectors(oldScreenshots => [...files, ...oldScreenshots]);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const saveSettings = useCallback((newSettings: Settings) => {
        setSettings(newSettings);
        settingsRef.current = newSettings;
        localStorage.setItem("settings", JSON.stringify(newSettings));
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!directoryHandleRef.current) {
                setInitDialogOpen(true);
            }

            // Load settings from localStorage
            const localStorageSettings = localStorage.getItem("settings");

            if (localStorageSettings) {
                const parsedSettings = JSON.parse(localStorageSettings) as Settings;
                setSettings(parsedSettings);
                settingsRef.current = parsedSettings;
            }
        }
    }, []);

    useEffect(() => {
        if (directoryStatus) {
            directoryScanIntervalRef.current = window.setInterval(scanDirectory, 1000);
        } else {
            if (directoryScanIntervalRef.current) {
                window.clearInterval(directoryScanIntervalRef.current);
            }
        }

        return () => {
            if (directoryScanIntervalRef.current) {
                window.clearInterval(directoryScanIntervalRef.current);
            }
        };
    }, [directoryStatus, scanDirectory]);

    useEffect(() => {
        setScreenshotVectors([]);
    }, [map]);

    return (
        <>
            <div className="fixed top-0 left-0 z-10">
                <MapMenu map={map} settings={settings} saveSettings={saveSettings} />
            </div>
            <MapStage map={map} myPositions={screenshotVectors} settings={settings} />
            <AlertDialog open={initDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("map.initDialog.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <p>{t("map.initDialog.description")}</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-y-2">
                        <AlertDialogAction onClick={onClickInitDialogAction}>
                            {t("map.initDialog.action")}
                        </AlertDialogAction>
                        <AlertDialogCancel onClick={onClickInitDialogClose}>
                            {t("map.initDialog.close")}
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
