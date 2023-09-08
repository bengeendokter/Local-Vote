"use client";
import "./globals.css";
import { useEffect } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL("https://local-vote.netlify.app"),
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
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
})
{
    useEffect(() =>
    {
        if("serviceWorker" in navigator)
        {
            window.addEventListener("load", function ()
            {
                navigator.serviceWorker.register("/sw.js").then(
                    function (registration)
                    {
                        console.log("Service Worker registration successful with scope: ", registration.scope);
                    },
                    function (err)
                    {
                        console.log("Service Worker registration failed: ", err);
                    }
                );
            });
        }
    }, []);

    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
