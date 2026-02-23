import React from 'react';
import { Montserrat, Lato } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

const lato = Lato({
    variable: "--font-lato",
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} ${lato.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
