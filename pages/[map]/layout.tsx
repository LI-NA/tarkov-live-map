export default function MapLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="w-screen h-screen">{children}</div>;
}
