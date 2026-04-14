import { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.dibrand.co"),
    alternates: {
        canonical: 'https://www.dibrand.co/',
    },
};

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

import ToasterProvider from "@/components/admin/ToasterProvider";

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="admin" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
            <body className="font-inter antialiased overflow-hidden">
                <ToasterProvider />
                {children}
            </body>
        </html>
    );
}
