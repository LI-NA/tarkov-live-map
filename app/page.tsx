import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { MAPS, MAP_TITLE, MAP_CONFING } from "@/constants/map";

export default function Home() {
    return (
        <div className="container mx-auto w-full min-h-screen flex justify-center items-center">
            <Card className="w-[32rem] max-w-full">
                <CardHeader>
                    <CardTitle>Welcome to tarkov live map!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        A project that allows the user to view a map in the game Escape From Tarkov and show the current
                        location and share it with friends.
                    </p>
                    <p>Please select your map.</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {MAPS.map(map => (
                        <Link key={map} href={`/${map}`} passHref legacyBehavior>
                            <Button className="w-full" variant="outline" size="lg" disabled={!MAP_CONFING[map].enable}>
                                {MAP_TITLE[map]} {MAP_CONFING[map].enable ? "" : "(Coming soon)"}
                            </Button>
                        </Link>
                    ))}
                </CardFooter>
            </Card>
        </div>
    );
}
