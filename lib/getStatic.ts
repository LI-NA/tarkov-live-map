import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nextConfig from "../next-i18next.config";

import type { GetStaticPropsContext, GetStaticPaths, GetStaticProps } from "next";

interface I18nPath {
    params: {
        locale: string;
    };
}

export const getI18nPaths = (): I18nPath[] =>
    i18nextConfig.i18n.locales.map((lng: string) => ({
        params: {
            locale: lng,
        },
    }));

export const mergeI18nPaths = (paths: { params: Record<string, string> }[]) => {
    const locales = getI18nPaths();

    return locales.flatMap(localePath =>
        paths.map(path => ({
            params: {
                ...localePath.params,
                ...path.params,
            },
        }))
    );
};

export const getStaticPaths = (() => {
    return {
        paths: getI18nPaths(),
        fallback: false,
    };
}) satisfies GetStaticPaths;

export async function getI18nProps(ctx: GetStaticPropsContext, ns: string[] = ["common"]) {
    const locale = ctx?.params?.locale as string;
    const props = {
        ...(await serverSideTranslations(locale, ns)),
    };
    return props;
}

export function makeStaticProps(ns: string[] = []) {
    return async function getStaticProps(ctx: GetStaticPropsContext) {
        return {
            props: await getI18nProps(ctx, ns),
        };
    } satisfies GetStaticProps;
}
