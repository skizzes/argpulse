"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ThumbsUp, ThumbsDown, MessageCircle, AlertCircle, Zap, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

export function SentimentThermometer() {
    const { t } = useLanguage();
    const [vote, setVote] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Mock stats for thermometers
    const marketHeat = 78; // High optimism
    const socialHeat = 52; // Neutral/Divided
    const generalPulse = 65; // Balanced growth

    useEffect(() => {
        const localVote = localStorage.getItem("argpulse_sentiment_vote");
        if (localVote) {
            setVote(localVote);
            setHasVoted(true);
        }
    }, []);

    const handleVote = (type: string) => {
        if (hasVoted) return;
        localStorage.setItem("argpulse_sentiment_vote", type);
        setVote(type);
        setHasVoted(true);
    };

    const shareSentiment = () => {
        const text = `My sentiment on ARG Economy is ${vote === 'bullish' ? '🚀 BULLISH' : '🐻 BEARISH'} via ARGPULSE Dashboard. #Argentina #Milei`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const Thermometer = ({ label, value, color, bgColor }: { label: string, value: number, color: string, bgColor: string }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                <span className={`text-sm font-black ${color}`}>{value}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${bgColor}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );

    const RadialGauge = ({ value, label }: { value: number, label: string }) => {
        const strokeDasharray = 251.2;
        const offset = strokeDasharray - (value / 100) * strokeDasharray;
        return (
            <div className="flex flex-col items-center justify-center p-2 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8"
                        fill="transparent" className="text-zinc-200 dark:text-zinc-800"
                    />
                    <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent" className="text-sky-500 transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black">{value}%</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter mt-2 text-muted-foreground">{label}</span>
            </div>
        );
    };

    return (
        <section id="thermometers" className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t.sentiment.title}</h2>
                    <p className="text-sm text-muted-foreground">{t.sentiment.subtitle}</p>
                </div>
                <Badge variant="outline" className="text-[10px] animate-pulse">Live Polling</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Statistics Gauges */}
                <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl p-6">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 w-full space-y-8">
                            <Thermometer label={t.sentiment.market} value={marketHeat} color="text-emerald-500" bgColor="bg-emerald-500" />
                            <Thermometer label={t.sentiment.social} value={socialHeat} color="text-indigo-500" bgColor="bg-indigo-500" />
                        </div>
                        <div className="shrink-0">
                            <RadialGauge value={generalPulse} label={t.sentiment.general} />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border/30 flex items-center gap-2 text-[10px] text-muted-foreground italic">
                        <AlertCircle className="h-3 w-3" />
                        {t.sentiment.subtitle}
                    </div>
                </Card>

                {/* Interactive Voting */}
                <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md shadow-2xl flex flex-col justify-center items-center p-6 text-center space-y-4">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg">{t.sentiment.general}</h3>
                        <p className="text-xs text-muted-foreground">Anonymous voting (1 per IP)</p>
                    </div>

                    {!hasVoted ? (
                        <div className="flex gap-4 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 h-16 border-emerald-500/50 hover:bg-emerald-500/20 gap-2 font-bold"
                                onClick={() => handleVote('bullish')}
                            >
                                <ThumbsUp className="h-5 w-5 text-emerald-500" />
                                <span className="uppercase">{t.sentiment.bullish}</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 h-16 border-rose-500/50 hover:bg-rose-500/20 gap-2 font-bold"
                                onClick={() => handleVote('bearish')}
                            >
                                <ThumbsDown className="h-5 w-5 text-rose-500" />
                                <span className="uppercase">{t.sentiment.bearish}</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className={`p-4 rounded-lg font-black text-xl tracking-tighter ${vote === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {vote === 'bullish' ? t.sentiment.bullish : t.sentiment.bearish} REGISTERED
                            </div>
                            <Button
                                variant="default"
                                className="w-full bg-sky-500 hover:bg-sky-600 gap-2"
                                onClick={shareSentiment}
                            >
                                <Share2 className="h-4 w-4" />
                                {t.common.share.toUpperCase()} TO X
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </section>
    );
}
