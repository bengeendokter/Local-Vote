import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Local Vote",
    description: "Make your own rankings",
    keywords: ["ranking"],
    authors: { name: "bengeendokter", url: "bengeendokter.be" },
    openGraph: {
        title: "Local Vote",
        description: "Make your own rankings",
        siteName: "Local Vote",
        locale: "en",
        images: {
            url: "./icon.png",
            alt: "Local Vote Logo",
        },
    },
    themeColor: "#F1E365",
    twitter: { card: "summary_large_image", creator: "@bengeendokter" },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
})
{
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
