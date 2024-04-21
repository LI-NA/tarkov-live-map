import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
    src: "../public/fonts/PretendardVariable.woff2",
    display: "swap",
    variable: "--font-pretendard",
});

export const metadata: Metadata = {
    title: "✨Tarkov Live Map✨",
    description:
        "A project that allows the user to view a map in the game Escape From Tarkov and show the current location and share it with friends.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pretendard.className} dark`}>
                {children}</body>
        </html>
    );
}
