"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, BarChart3, CheckCircle2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

const POLL_OPTIONS_ES = [
    { id: "down", label: "Baja 📉", range: "< $1,150" },
    { id: "stable", label: "Estable 😐", range: "$1,150 — $1,200" },
    { id: "up_mild", label: "Sube poco 📈", range: "$1,200 — $1,300" },
    { id: "up_strong", label: "Sube fuerte 🚀", range: "> $1,300" },
];

const POLL_OPTIONS_EN = [
    { id: "down", label: "Goes Down 📉", range: "< $1,150" },
    { id: "stable", label: "Stays Flat 😐", range: "$1,150 — $1,200" },
    { id: "up_mild", label: "Slight Rise 📈", range: "$1,200 — $1,300" },
    { id: "up_strong", label: "Strong Rise 🚀", range: "> $1,300" },
];

// Simulated community results (would be server-side in production)
const MOCK_RESULTS: Record<string, number> = {
    down: 12,
    stable: 38,
    up_mild: 35,
    up_strong: 15,
};

export function WeeklyPoll() {
    const { t, locale } = useLanguage();
    const [voted, setVoted] = useState<string | null>(null);
    const [results, setResults] = useState(MOCK_RESULTS);
    const [animate, setAnimate] = useState(false);

    const options = locale === "es" ? POLL_OPTIONS_ES : POLL_OPTIONS_EN;

    useEffect(() => {
        const saved = localStorage.getItem("argpulse_weekly_poll_vote");
        if (saved) {
            setVoted(saved);
            // Increment the saved vote in results
            setResults((prev) => ({ ...prev, [saved]: (prev[saved] || 0) + 1 }));
        }
    }, []);

    const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

    const handleVote = (optionId: string) => {
        if (voted) return;
        localStorage.setItem("argpulse_weekly_poll_vote", optionId);
        setVoted(optionId);
        setResults((prev) => ({ ...prev, [optionId]: (prev[optionId] || 0) + 1 }));
        setTimeout(() => setAnimate(true), 100);
    };

    const shareToX = () => {
        const votedOption = options.find((o) => o.id === voted);
        const textEs = `🗳️ Voté en ARGPULSE: el dólar blue esta semana ${votedOption?.label} (${votedOption?.range}). ¿Vos qué decís? 🇦🇷\n\nhttps://argpulse.com`;
        const textEn = `🗳️ I voted on ARGPULSE: the Argentine Blue Dollar this week ${votedOption?.label} (${votedOption?.range}). What's your take? 🇦🇷\n\nhttps://argpulse.com`;
        const text = locale === "es" ? textEs : textEn;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <Card className="border-border/50 bg-gradient-to-br from-indigo-500/5 via-card/50 to-sky-500/5 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                        <h3 className="text-lg font-bold">
                            {locale === "es" ? "Encuesta Semanal" : "Weekly Poll"}
                        </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold animate-pulse border-indigo-500/30 text-indigo-400">
                        LIVE
                    </Badge>
                </div>

                {/* Question */}
                <p className="text-sm font-medium text-foreground/90">
                    {locale === "es"
                        ? "¿Cómo cerrará el Dólar Blue esta semana?"
                        : "How will the Blue Dollar close this week?"}
                </p>

                {/* Options */}
                <div className="space-y-2">
                    {options.map((option) => {
                        const pct = totalVotes > 0 ? Math.round((results[option.id] / totalVotes) * 100) : 0;
                        const isSelected = voted === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                                disabled={!!voted}
                                className={`w-full relative overflow-hidden rounded-xl border transition-all duration-300 ${isSelected
                                        ? "border-indigo-500/50 bg-indigo-500/10"
                                        : voted
                                            ? "border-border/30 bg-muted/20 opacity-70"
                                            : "border-border/50 bg-card/80 hover:border-indigo-500/30 hover:bg-indigo-500/5 cursor-pointer"
                                    }`}
                            >
                                {/* Result bar background */}
                                {voted && (
                                    <div
                                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${isSelected ? "bg-indigo-500/15" : "bg-muted/30"
                                            }`}
                                        style={{ width: animate ? `${pct}%` : "0%" }}
                                    />
                                )}

                                <div className="relative flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {voted && isSelected && (
                                            <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                                        )}
                                        <span className="text-sm font-bold">{option.label}</span>
                                        <span className="text-xs text-muted-foreground">{option.range}</span>
                                    </div>
                                    {voted ? (
                                        <span className={`text-sm font-black ${isSelected ? "text-indigo-400" : "text-muted-foreground"}`}>
                                            {pct}%
                                        </span>
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                {voted ? (
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {totalVotes.toLocaleString()} {locale === "es" ? "votos" : "votes"}
                        </span>
                        <Button
                            size="sm"
                            className="bg-sky-500 hover:bg-sky-600 gap-2 text-xs font-bold"
                            onClick={shareToX}
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            {locale === "es" ? "Compartir en 𝕏" : "Share on 𝕏"}
                        </Button>
                    </div>
                ) : (
                    <p className="text-[10px] text-muted-foreground text-center">
                        {locale === "es" ? "Anónimo · 1 voto por usuario" : "Anonymous · 1 vote per user"}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
