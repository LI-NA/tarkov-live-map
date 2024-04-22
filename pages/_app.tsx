import type { AppProps } from "next/app";
import Head from "next/head";
import localFont from "next/font/local";
import { appWithTranslation, useTranslation } from "next-i18next";

import "@/styles/globals.css";

const pretendard = localFont({
    src: "../public/fonts/PretendardVariable.woff2",
    display: "swap",
    variable: "--font-pretendard",
});

const App = ({ Component, pageProps }: AppProps) => {
    const { t } = useTranslation("common");

    return (
        <div className={pretendard.className}>
            <Head>
                <title>✨{t("head.title")}✨</title>
                <meta name="description" content={t("head.description")} />
            </Head>
            <Component {...pageProps} />
        </div>
    );
};

export default appWithTranslation(App);
