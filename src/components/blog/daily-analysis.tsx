"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/shared/language-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    BookOpenText,
    CalendarDays,
    Sparkles,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    ShieldAlert,
    ShieldCheck,
    ShieldMinus,
    ArrowRight,
    Clock,
} from "lucide-react";
import type { DailyAnalysisPost } from "@/lib/daily-analysis";

interface DailyAnalysisProps {
    post: DailyAnalysisPost;
    compact?: boolean;
}

const sentimentConfig = {
    bullish: {
        colorClass: "text-emerald-400",
        bgClass: "from-emerald-500/10 via-card/50 to-teal-500/5",
        borderClass: "border-emerald-500/20",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        labelEs: "Optimista",
        labelEn: "Bullish",
        Icon: TrendingUp,
    },
    bearish: {
        colorClass: "text-red-400",
        bgClass: "from-red-500/10 via-card/50 to-rose-500/5",
        borderClass: "border-red-500/20",
        badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
        labelEs: "Bajista",
        labelEn: "Bearish",
        Icon: TrendingDown,
    },
    neutral: {
        colorClass: "text-sky-400",
        bgClass: "from-sky-500/10 via-card/50 to-blue-500/5",
        borderClass: "border-sky-500/20",
        badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        labelEs: "Neutro",
        labelEn: "Neutral",
        Icon: Minus,
    },
    mixed: {
        colorClass: "text-amber-400",
        bgClass: "from-amber-500/10 via-card/50 to-yellow-500/5",
        borderClass: "border-amber-500/20",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        labelEs: "Mixto",
        labelEn: "Mixed",
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
            <strong key={i} className="font-bold text-foreground">
                {part.slice(2, -2)}
            </strong>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

export function DailyAnalysis({ post, compact = false }: DailyAnalysisProps) {
    const { locale } = useLanguage();
    const [expanded, setExpanded] = useState(!compact);
    const cfg = sentimentConfig[post.sentiment];
    const risk = riskConfig[post.riskLevel ?? "medium"];
    const SentimentIcon = cfg.Icon;
    const RiskIcon = risk.icon;

    const title = locale === "es" ? post.titleEs : post.titleEn;
    const summary = locale === "es" ? post.summaryEs : post.summaryEn;
    const keyPoints = locale === "es" ? post.keyPointsEs : post.keyPointsEn;
    const sections = post.sections ?? [];

    return (
        <section id="blog" className="w-full space-y-6">
            {/* Section Header */}
            {!compact && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <BookOpenText className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-black tracking-tight">
                                {locale === "es" ? "Análisis Diario" : "Daily Analysis"}
                            </h2>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold animate-pulse border-primary/30 text-primary">
                            AUTO-GENERADO
                        </Badge>
                    </div>
                    <Link
                        href="/analisis-diario"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <Clock className="h-3.5 w-3.5" />
                        {locale === "es" ? "Ver historial completo" : "View full history"}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            )}
            {!compact && (
                <p className="text-sm text-muted-foreground -mt-2">
                    {locale === "es"
                        ? "Análisis generado automáticamente a partir de indicadores económicos en tiempo real."
                        : "Analysis automatically generated from real-time economic indicators."}
                </p>
            )}

            {/* Main Card */}
            <Card className={`border ${cfg.borderClass} bg-gradient-to-br ${cfg.bgClass} backdrop-blur-sm shadow-2xl overflow-hidden relative`}>
                {/* Top glow accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent ${cfg.colorClass} opacity-60`} />

                <CardContent className="p-6 md:p-8 space-y-6">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>{post.dateFormatted}</span>
                        </div>
                        <Badge className={`text-[10px] font-bold border ${cfg.badgeClass} flex items-center gap-1`}>
                            <SentimentIcon className="h-3 w-3" />
                            {locale === "es" ? cfg.labelEs : cfg.labelEn}
                        </Badge>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${risk.class}`}>
                            <RiskIcon className="h-3.5 w-3.5" />
                            {locale === "es" ? risk.labelEs : risk.labelEn}
                        </div>
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground border-border/40">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-black leading-tight text-foreground">
                        {title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {renderMarkdown(summary)}
                    </p>

                    {/* Highlights grid */}
                    {post.highlights.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {post.highlights.map((h) => (
                                <div
                                    key={h.labelEs}
                                    className="rounded-xl border border-border/40 bg-card/60 px-3 py-3 space-y-1"
                                >
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
                        <div className="rounded-xl border border-border/30 bg-card/40 p-4 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                {locale === "es" ? "Puntos Clave del Día" : "Key Points of the Day"}
                            </p>
                            <ul className="space-y-2">
                                {keyPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.colorClass}`} />
                                        <span>{renderMarkdown(point)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Expand/Collapse button */}
                    {sections.length > 0 && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className={`flex items-center gap-2 text-xs font-bold ${cfg.colorClass} hover:opacity-80 transition-opacity`}
                        >
                            {expanded
                                ? (locale === "es" ? "Ocultar análisis completo" : "Hide full analysis")
                                : (locale === "es" ? "Leer análisis completo" : "Read full analysis")}
                            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                    )}

                    {/* Extended Sections */}
                    {expanded && sections.length > 0 && (
                        <div className="space-y-6 pt-2 border-t border-border/20">
                            {sections.map((section, i) => {
                                const secTitle = locale === "es" ? section.titleEs : section.titleEn;
                                const secContent = locale === "es" ? section.contentEs : section.contentEn;
                                // Split by double newline for paragraphs
                                const paragraphs = secContent.split(/\n\n+/).filter(Boolean);

                                return (
                                    <div key={i} className="space-y-3">
                                        <h4 className="text-base font-black text-foreground">{secTitle}</h4>
                                        <div className="space-y-3">
                                            {paragraphs.map((para, j) => (
                                                <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                                                    {renderMarkdown(para)}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-2 border-t border-border/20 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                            {locale === "es"
                                ? "Generado por ARGPULSE Intelligence Engine"
                                : "Generated by ARGPULSE Intelligence Engine"}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/40">
                            {post.id}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
