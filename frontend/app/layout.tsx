import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
    title: "Applicant Tracking System",
    description: "Streamline your hiring with ATS",
    openGraph: {
        title: "ATS",
        description: "Streamline your hiring with ATS",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Providers>{children}</Providers>
                <Analytics/>
            </body>
        </html>
    );
}
