import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/themeProvider";
import StyledComponentsRegistry from "@/lib/registry";
import ThemeToggleWrapper from "@/components/ThemeToggleWrapper";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
    display: "swap",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Next.js Application",
    description: "A modern Next.js application with TypeScript and Tailwind CSS",
    viewport: "width=device-width, initial-scale=1",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <StyledComponentsRegistry>
                        <ThemeToggleWrapper />
                        {children}
                    </StyledComponentsRegistry>
                </ThemeProvider>
            </body>
        </html>
    );
}
