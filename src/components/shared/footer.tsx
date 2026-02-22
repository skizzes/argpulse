"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./language-context";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="w-full border-t border-border/40 bg-background/95 py-8 mt-12">
            <div className="container mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <Image
                        src="/logo.webp"
                        alt="ArgPulse"
                        width={100}
                        height={25}
                        className="h-6 w-auto opacity-70"
                    />
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-xs text-muted-foreground">{t.footer.disclaimer}</span>
                </div>

                <div className="text-sm flex items-center gap-1.5">
                    <span className="text-muted-foreground">{t.footer.dev}</span>
                    <Link
                        href="https://x.com/LucasSkizzes"
                        target="_blank"
                        className="font-black hover:text-primary transition-colors"
                    >
                        SkizzeS
                    </Link>
                </div>
            </div>
        </footer>
    );
}
