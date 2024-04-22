import Link from "next/link";
import { useRouter } from "next/router";

import { getQuery } from "@/lib/query";

import type { FC, ComponentProps } from "react";

const LinkComponent: FC<ComponentProps<typeof Link>> = ({ children, href, ...rest }) => {
    const router = useRouter();
    const locale = getQuery(router.query.locale) ?? "";

    let hrefWithLocale = href || router.asPath;

    if (locale) {
        if (typeof href === "string") {
            if (href.indexOf("http") !== 0) {
                hrefWithLocale = hrefWithLocale ? `/${locale}${href}` : router.pathname.replace("[locale]", locale);
            }
        } else {
            if (href.host === window.location.host && href?.pathname) {
                hrefWithLocale = hrefWithLocale
                    ? `/${locale}${href.pathname}${href.search ?? ""}${href.hash ?? ""}`
                    : router.pathname.replace("[locale]", locale);
            }
        }
    }

    return (
        <Link href={hrefWithLocale} {...rest}>
            {children}
        </Link>
    );
};

export default LinkComponent;
