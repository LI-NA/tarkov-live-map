"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), {
    ssr: false,
});

import type { Map as MapType } from "@/constants/map";

export default function Home({
    params: { map },
}: {
    params: {
        map: MapType;
    };
}) {
    return <Map map={map} />;
}
