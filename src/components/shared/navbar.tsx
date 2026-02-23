"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLanguage } from "./language-context";

export function Navbar() {
    const { locale, setLocale, t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: "/#indicators", label: t.nav.economic },
        { href: "/#inflation", label: t.nav.inflation },
        { href: "/#strategic", label: t.nav.strategic },
        { href: "/#markets", label: t.nav.markets },
        { href: "/analisis-diario", label: t.nav.daily, highlight: true },
    ];


    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-8">
                <div className="flex gap-4 md:gap-10 items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.webp"
                            alt="ArgPulse"
                            width={160}
                            height={40}
                            className="h-8 w-auto md:h-10"
                            priority
                        />
                    </Link>
                    <nav className="hidden lg:flex gap-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${link.highlight ? "text-primary" : ""
                                    }`}
                            >
                                {link.highlight && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                                    </span>
                                )}
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 mr-2 md:mr-4 bg-muted/20 p-1 rounded-full border border-border/40">
                        <button
                            onClick={() => setLocale("es")}
                            className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full overflow-hidden transition-all ${locale === 'es' ? 'ring-2 ring-sky-400 shadow-lg shadow-sky-400/30 scale-110' : 'opacity-50 hover:opacity-80'}`}
                            title="Español"
                        >
                            {/* Argentina flag background */}
                            <div className="absolute inset-0 flex flex-col">
                                <div className="flex-1 bg-[#74ACDF]" />
                                <div className="flex-1 bg-white" />
                                <div className="flex-1 bg-[#74ACDF]" />
                            </div>
                            <span className="relative z-10 text-[10px] font-black text-slate-800 drop-shadow-sm">AR</span>
                        </button>
                        <button
                            onClick={() => setLocale("en")}
                            className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full overflow-hidden transition-all ${locale === 'en' ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30 scale-110' : 'opacity-50 hover:opacity-80'}`}
                            title="English"
                        >
                            {/* USA flag background */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex-1 bg-[#B22234]" />
                                    <div className="flex-1 bg-white" />
                                    <div className="flex-1 bg-[#B22234]" />
                                    <div className="flex-1 bg-white" />
                                    <div className="flex-1 bg-[#B22234]" />
                                </div>
                                <div className="absolute top-0 left-0 w-[45%] h-[60%] bg-[#3C3B6E]" />
                            </div>
                            <span className="relative z-10 text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">US</span>
                        </button>
                    </div>

                    {/* Live indicator - hidden on very small screens */}
                    <nav className="hidden sm:flex items-center space-x-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground whitespace-nowrap">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {t.nav.liveUpdates}
                        </div>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-border/40 bg-background/98 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
                    <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors ${link.highlight ? "text-primary" : ""
                                    }`}
                            >
                                {link.highlight && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                                    </span>
                                )}
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground mt-2 px-4 pt-3 border-t border-border/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {t.nav.liveUpdates}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
