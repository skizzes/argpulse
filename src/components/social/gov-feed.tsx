"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/shared/language-context";

const ACCOUNTS = [
    {
        id: "milei",
        handle: "JMilei",
        label: "Javier Milei",
        emoji: "🦁",
    },
    {
        id: "adorni",
        handle: "madorni",
        label: "Manuel Adorni",
        emoji: "🎙️",
    },
    {
        id: "casarosada",
        handle: "CasaRosada",
        label: "Casa Rosada",
        emoji: "🏛️",
    },
];

function TwitterTimeline({ handle }: { handle: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing content
        containerRef.current.innerHTML = "";

        // Create the timeline anchor
        const anchor = document.createElement("a");
        anchor.setAttribute("class", "twitter-timeline");
        anchor.setAttribute("data-theme", "dark");
        anchor.setAttribute("data-chrome", "noheader nofooter noborders transparent");
        anchor.setAttribute("data-height", "600");
        anchor.setAttribute("data-tweet-limit", "5");
        anchor.setAttribute("href", `https://twitter.com/${handle}`);
        anchor.textContent = `Loading @${handle}...`;
        containerRef.current.appendChild(anchor);

        // Load/reload the Twitter widget script
        const existingScript = document.getElementById("twitter-wjs");
        if (existingScript) {
            existingScript.remove();
        }
        const script = document.createElement("script");
        script.id = "twitter-wjs";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);

        // If twttr is already loaded, just render
        if ((window as any).twttr?.widgets) {
            (window as any).twttr.widgets.load(containerRef.current);
        }
    }, [handle]);

    return (
        <div
            ref={containerRef}
            className="w-full min-h-[400px] rounded-xl overflow-hidden"
        />
    );
}

export function GovFeed() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("milei");

    const activeAccount = ACCOUNTS.find((a) => a.id === activeTab)!;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{t.markets.signals}</h2>
                <p className="text-sm text-muted-foreground">{t.social.subtitle}</p>
            </div>

            {/* Account Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {ACCOUNTS.map((account) => (
                    <button
                        key={account.id}
                        onClick={() => setActiveTab(account.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === account.id
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/50"
                            }`}
                    >
                        <span className="text-base">{account.emoji}</span>
                        <span className="hidden sm:inline">{account.label}</span>
                        <span className="sm:hidden">@{account.handle}</span>
                    </button>
                ))}
            </div>

            {/* Active Timeline */}
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30 bg-muted/20">
                    <span className="text-lg">{activeAccount.emoji}</span>
                    <div>
                        <span className="font-bold text-sm">{activeAccount.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">@{activeAccount.handle}</span>
                    </div>
                    <a
                        href={`https://x.com/${activeAccount.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-xs font-bold text-sky-500 hover:text-sky-400 transition-colors"
                    >
                        View on 𝕏 →
                    </a>
                </div>
                <div className="p-4">
                    <TwitterTimeline handle={activeAccount.handle} />
                </div>
            </div>
        </div>
    );
}
