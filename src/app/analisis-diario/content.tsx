"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/shared/language-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp, TrendingDown, Minus, Sparkles,
    CalendarDays, ChevronDown, ChevronUp,
    CheckCircle2, ArrowLeft, Clock,
    ShieldCheck, ShieldMinus, ShieldAlert,
} from "lucide-react";
import type { DailyAnalysisPost } from "@/lib/daily-analysis";

const sentimentConfig = {
    bullish: {
        colorClass: "text-emerald-400",
        bgClass: "from-emerald-500/8 to-teal-500/4",
        borderClass: "border-emerald-500/20",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dotClass: "bg-emerald-400",
        labelEs: "Optimista", labelEn: "Bullish",
        Icon: TrendingUp,
    },
    bearish: {
        colorClass: "text-red-400",
        bgClass: "from-red-500/8 to-rose-500/4",
        borderClass: "border-red-500/20",
        badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
        dotClass: "bg-red-400",
        labelEs: "Bajista", labelEn: "Bearish",
        Icon: TrendingDown,
    },
    neutral: {
        colorClass: "text-sky-400",
        bgClass: "from-sky-500/8 to-blue-500/4",
        borderClass: "border-sky-500/20",
        badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        dotClass: "bg-sky-400",
        labelEs: "Neutro", labelEn: "Neutral",
        Icon: Minus,
    },
    mixed: {
        colorClass: "text-amber-400",
        bgClass: "from-amber-500/8 to-yellow-500/4",
        borderClass: "border-amber-500/20",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dotClass: "bg-amber-400",
        labelEs: "Mixto", labelEn: "Mixed",
        Icon: Sparkles,
    },
};

const riskConfig = {
    low: { icon: ShieldCheck, class: "text-emerald-400", labelEs: "Riesgo Bajo", labelEn: "Low Risk" },
    medium: { icon: ShieldMinus, class: "text-amber-400", labelEs: "Riesgo Moderado", labelEn: "Moderate Risk" },
    high: { icon: ShieldAlert, class: "text-red-400", labelEs: "Riesgo Alto", labelEn: "High Risk" },
};

const trendIcon = {
    up: <TrendingUp className="h-3 w-3 text-emerald-400" />,
    down: <TrendingDown className="h-3 w-3 text-red-400" />,
    neutral: <Minus className="h-3 w-3 text-muted-foreground" />,
};

function renderMarkdown(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
        ) : <span key={i}>{part}</span>
    );
}

type SentimentFilter = "all" | "bullish" | "bearish" | "neutral" | "mixed";

function HistoryCard({ post, locale }: { post: DailyAnalysisPost; locale: string }) {
    const [open, setOpen] = useState(false);
    const cfg = sentimentConfig[post.sentiment];
    const risk = riskConfig[post.riskLevel ?? "medium"];
    const SentimentIcon = cfg.Icon;
    const RiskIcon = risk.icon;
    const title = locale === "es" ? post.titleEs : post.titleEn;
    const summary = locale === "es" ? post.summaryEs : post.summaryEn;
    const keyPoints = locale === "es" ? post.keyPointsEs : post.keyPointsEn;

    return (
        <Card className={`border ${cfg.borderClass} bg-gradient-to-br ${cfg.bgClass} transition-all duration-200`}>
            <CardContent className="p-5 space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span className="font-medium">{post.dateFormatted}</span>
                        </div>
                        <Badge className={`text-[10px] font-bold border ${cfg.badgeClass} flex items-center gap-1`}>
                            <SentimentIcon className="h-3 w-3" />
                            {locale === "es" ? cfg.labelEs : cfg.labelEn}
                        </Badge>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${risk.class}`}>
                            <RiskIcon className="h-3 w-3" />
                            {locale === "es" ? risk.labelEs : risk.labelEn}
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className={`flex items-center gap-1 text-xs font-semibold ${cfg.colorClass} hover:opacity-70 transition-opacity shrink-0`}
                    >
                        {open
                            ? (locale === "es" ? "Cerrar" : "Close")
                            : (locale === "es" ? "Ver detalle" : "View detail")}
                        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-black leading-snug text-foreground">{title}</h3>

                {/* Summary */}
                <p className="text-sm text-muted-foreground leading-relaxed">{renderMarkdown(summary)}</p>

                {/* Expanded detail */}
                {open && (
                    <div className="space-y-4 pt-3 border-t border-border/20">
                        {/* Highlights */}
                        {post.highlights.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                                {post.highlights.map((h) => (
                                    <div key={h.labelEs} className="rounded-lg border border-border/30 bg-card/50 px-3 py-2 space-y-1">
                                        <div className="flex items-center gap-1">
                                            {trendIcon[h.trend]}
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                                {locale === "es" ? h.labelEs : h.labelEn}
                                            </span>
                                        </div>
                                        <p className="text-sm font-black tabular-nums">{h.value}</p>
                                        {(locale === "es" ? h.noteEs : h.noteEn) && (
                                            <p className="text-[9px] text-muted-foreground/70">
                                                {locale === "es" ? h.noteEs : h.noteEn}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Key Points */}
                        {keyPoints && keyPoints.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {locale === "es" ? "Puntos Clave" : "Key Points"}
                                </p>
                                <ul className="space-y-1.5">
                                    {keyPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${cfg.colorClass}`} />
                                            <span>{renderMarkdown(point)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Extended Sections */}
                        {post.sections && post.sections.length > 0 && (
                            <div className="space-y-4 pt-2 border-t border-border/20">
                                {post.sections.map((section, i) => {
                                    const secTitle = locale === "es" ? section.titleEs : section.titleEn;
                                    const secContent = locale === "es" ? section.contentEs : section.contentEn;
                                    const paragraphs = secContent.split(/\n\n+/).filter(Boolean);
                                    return (
                                        <div key={i} className="space-y-2">
                                            <h4 className="text-sm font-black text-foreground">{secTitle}</h4>
                                            {paragraphs.map((para, j) => (
                                                <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                                                    {renderMarkdown(para)}
                                                </p>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground border-border/30">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface HistoryContentProps {
    posts: DailyAnalysisPost[];
}

export function HistoryContent({ posts }: HistoryContentProps) {
    const { locale } = useLanguage();
    const [filter, setFilter] = useState<SentimentFilter>("all");

    const filtered = useMemo(() => {
        if (filter === "all") return posts;
        return posts.filter((p) => p.sentiment === filter);
    }, [posts, filter]);

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: posts.length, bullish: 0, bearish: 0, neutral: 0, mixed: 0 };
        posts.forEach((p) => c[p.sentiment]++);
        return c;
    }, [posts]);

    const filters: { key: SentimentFilter; labelEs: string; labelEn: string; colorClass: string }[] = [
        { key: "all", labelEs: "Todos", labelEn: "All", colorClass: "text-foreground" },
        { key: "bullish", labelEs: "Optimista", labelEn: "Bullish", colorClass: "text-emerald-400" },
        { key: "bearish", labelEs: "Bajista", labelEn: "Bearish", colorClass: "text-red-400" },
        { key: "neutral", labelEs: "Neutro", labelEn: "Neutral", colorClass: "text-sky-400" },
        { key: "mixed", labelEs: "Mixto", labelEn: "Mixed", colorClass: "text-amber-400" },
    ];

    return (
        <div className="space-y-8">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                {locale === "es" ? "Volver al inicio" : "Back to home"}
            </Link>

            {/* Page header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-black tracking-tight">
                        {locale === "es" ? "Historial de Análisis Diarios" : "Daily Analysis History"}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {locale === "es"
                        ? `${posts.length} análisis registrados — generados automáticamente por el Motor ARGPULSE Intelligence.`
                        : `${posts.length} analyses recorded — automatically generated by the ARGPULSE Intelligence Engine.`}
                </p>
            </div>

            {/* Sentiment stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["bullish", "bearish", "neutral", "mixed"] as const).map((s) => {
                    const cfg = sentimentConfig[s];
                    const SIcon = cfg.Icon;
                    const pct = posts.length > 0 ? Math.round((counts[s] / posts.length) * 100) : 0;
                    return (
                        <div key={s} className={`rounded-xl border ${cfg.borderClass} bg-gradient-to-br ${cfg.bgClass} p-4 space-y-1`}>
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${cfg.colorClass}`}>
                                <SIcon className="h-3.5 w-3.5" />
                                {locale === "es" ? cfg.labelEs : cfg.labelEn}
                            </div>
                            <p className="text-2xl font-black">{counts[s]}</p>
                            <p className="text-[10px] text-muted-foreground">{pct}% {locale === "es" ? "del total" : "of total"}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${filter === f.key
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                    >
                        {locale === "es" ? f.labelEs : f.labelEn}
                        <span className="ml-1.5 opacity-60">({counts[f.key]})</span>
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="relative space-y-4">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/30 hidden sm:block" />

                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                        {locale === "es" ? "No hay análisis para este filtro." : "No analyses for this filter."}
                    </div>
                ) : (
                    filtered.map((post) => {
                        const cfg = sentimentConfig[post.sentiment];
                        return (
                            <div key={post.id} className="flex gap-4 sm:gap-6 items-start">
                                {/* Timeline dot */}
                                <div className={`hidden sm:flex mt-5 h-4 w-4 rounded-full border-2 border-background ${cfg.dotClass} shrink-0 shadow`} />
                                <div className="flex-1 min-w-0">
                                    <HistoryCard post={post} locale={locale} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
