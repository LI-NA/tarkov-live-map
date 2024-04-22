import Document, { Html, Head, Main, NextScript } from "next/document";

import { getQuery } from "@/lib/query";

import i18nextConfig from "../next-i18next.config";

class MyDocument extends Document {
    render() {
        const currentLocale = getQuery(this.props.__NEXT_DATA__.query.locale) || i18nextConfig.i18n.defaultLocale;

        return (
            <Html lang={currentLocale}>
                <Head />
                <body className="dark">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
