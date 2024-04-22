import Head from "next/head";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Head>
                <title>✨Tarkov Live Map✨</title>
                <meta
                    name="description"
                    content="A project that allows the user to view a map in the game Escape From Tarkov and show the current location and share it with friends."
                />
            </Head>
            {children}
        </>
    );
}
