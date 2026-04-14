import { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.dibrand.co"),
    alternates: {
        canonical: 'https://www.dibrand.co/',
    },
};
import ToasterProvider from "@/components/admin/ToasterProvider";

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

export default function AtsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`} data-theme="ats" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <ToasterProvider />
                {children}
            </body>
        </html>
    );
}
