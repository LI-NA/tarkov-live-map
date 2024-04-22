import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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

import { mergeI18nPaths, makeStaticProps } from "@/lib/getStatic";
import { getQueryWithoutUndefined } from "@/lib/query";

import type { GetStaticPaths } from "next";
import type { Map } from "@/constants/map";

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

    const map = getQueryWithoutUndefined<Map>(router.query.map);

    const [initDialogOpen, setInitDialogOpen] = useState(false);

    const onClickInitDialogAction = useCallback(() => {
        // Do something
    }, []);

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
                        <AlertDialogTitle>{t("map.initDialog.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <p>{t("map.initDialog.description")}</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
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
