import { useTranslation } from "next-i18next";

import Link from "@/components/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { MAPS, MAP_CONFING } from "@/constants/map";

import { getStaticPaths, makeStaticProps } from "@/lib/getStatic";

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };

export default function Index() {
    const { t } = useTranslation("common");

    return (
        <div className="container mx-auto w-full min-h-screen flex justify-center items-center">
            <Card className="w-[32rem] max-w-full">
                <CardHeader>
                    <CardTitle>{t("main.welcome")}</CardTitle>
                    <CardDescription>{t("main.description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>{t("main.selectMap")}</p>
                    <section className="flex flex-col gap-2">
                        {MAPS.map(map => (
                            <Link key={map} href={`/${map}`} passHref legacyBehavior>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    size="lg"
                                    disabled={!MAP_CONFING[map].enable}
                                >
                                    {t("map.title", {
                                        context: map,
                                    })}{" "}
                                    {MAP_CONFING[map].enable ? "" : "(Coming soon)"}
                                </Button>
                            </Link>
                        ))}
                    </section>
                    <section className="flex flex-col gap-1">
                        <p className="text-sm">{t("main.disclaimer")}</p>
                        <p className="text-sm text-muted-foreground">{t("main.disclaimer.description")}</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
