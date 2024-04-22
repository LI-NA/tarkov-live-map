import type { AppProps } from "next/app";
import localFont from "next/font/local";

import "@/styles/globals.css";

const pretendard = localFont({
    src: "../public/fonts/PretendardVariable.woff2",
    display: "swap",
    variable: "--font-pretendard",
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={pretendard.className}>
            <Component {...pageProps} />
        </div>
    );
}
