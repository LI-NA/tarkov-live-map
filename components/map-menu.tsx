import { useCallback } from "react";
import { useTranslation } from "next-i18next";

import Link from "@/components/link";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarGroup,
    MenubarLabel,
    MenubarShortcut,
} from "@/components/ui/menubar";

import { MAPS, MAP_CONFING } from "@/constants/map";

import type { Map as MapType } from "@/constants/map";
import type { Settings } from "@/constants/settings";

const MapMenu = ({
    map,
    settings,
    saveSettings,
}: {
    map: MapType;
    settings: Settings;
    saveSettings: (settings: Settings) => void;
}) => {
    const { t } = useTranslation("common");

    const changeMarkerAnimation = useCallback(
        (event: Event) => {
            event.preventDefault();
            saveSettings({ ...settings, markerAnimation: !settings.markerAnimation });
        },
        [settings, saveSettings]
    );

    const changeScreenshotAutoDelete = useCallback(
        (event: Event) => {
            event.preventDefault();
            saveSettings({ ...settings, screenshotAutoDelete: !settings.screenshotAutoDelete });
        },
        [settings, saveSettings]
    );

    return (
        <Menubar className="rounded-t-none rounded-bl-none border-t-0 border-l-0">
            <MenubarMenu>
                <MenubarTrigger>{t("map.menu.maps")}</MenubarTrigger>
                <MenubarContent>
                    {MAPS.map(m => (
                        <Link key={m} href={`/${m}`} passHref legacyBehavior>
                            <MenubarItem disabled={!MAP_CONFING[m].enable}>
                                {t("map.title", {
                                    context: m,
                                })}
                                {m === map && <MenubarShortcut className="w-3 h-3 rounded-full bg-green-600" />}
                            </MenubarItem>
                        </Link>
                    ))}
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{t("map.menu.online")}</MenubarTrigger>
                <MenubarContent>
                    <MenubarLabel>{t("map.menu.soon")}</MenubarLabel>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{t("map.menu.settings")}</MenubarTrigger>
                <MenubarContent>
                    <MenubarGroup>
                        <MenubarLabel>{t("map.menu.settings.marker")}</MenubarLabel>
                        <MenubarItem disabled>
                            {t("map.menu.settings.marker.color")}
                            <MenubarShortcut
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: settings.markerColor }}
                            />
                        </MenubarItem>
                        <MenubarItem disabled>
                            {t("map.menu.settings.marker.size")}
                            <MenubarShortcut>{settings.markerSize}</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem onSelect={changeMarkerAnimation}>
                            {t("map.menu.settings.marker.animation")}
                            <MenubarShortcut>
                                {t("map.menu.settings.onOff", {
                                    context: settings.markerAnimation.toString(),
                                })}
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                    </MenubarGroup>
                    <MenubarGroup>
                        <MenubarLabel>{t("map.menu.settings.screenshot")}</MenubarLabel>
                        <MenubarItem>{t("map.menu.settings.screenshot.folder")}</MenubarItem>
                        <MenubarItem onSelect={changeScreenshotAutoDelete}>
                            {t("map.menu.settings.screenshot.autoDelete")}
                            <MenubarShortcut>
                                {t("map.menu.settings.onOff", {
                                    context: settings.screenshotAutoDelete.toString(),
                                })}
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                    </MenubarGroup>
                    <Link href="/" passHref legacyBehavior>
                        <MenubarItem>{t("map.menu.settings.main")}</MenubarItem>
                    </Link>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default MapMenu;
