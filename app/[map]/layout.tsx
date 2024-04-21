import { MAPS } from "@/constants/map";

export function generateStaticParams() {
    return MAPS.map(map => {
        return { map };
    });
}

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-screen h-screen">
        {children}
    </div>;
}
