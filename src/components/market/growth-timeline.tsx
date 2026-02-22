"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Zap, Landmark, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

export function GrowthTimeline() {
    const { t } = useLanguage();

    const GROWTH_MILESTONES = [
        {
            date: "Feb 2026",
            title: t.timeline.m1title,
            description: t.timeline.m1desc,
            icon: <Landmark className="h-5 w-5 text-indigo-400" />,
            status: "current"
        },
        {
            date: "Dec 2025",
            title: t.timeline.m2title,
            description: t.timeline.m2desc,
            icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
            status: "complete"
        },
        {
            date: "Aug 2025",
            title: t.timeline.m3title,
            description: t.timeline.m3desc,
            icon: <Zap className="h-5 w-5 text-yellow-400" />,
            status: "complete"
        },
        {
            date: "May 2025",
            title: t.timeline.m4title,
            description: t.timeline.m4desc,
            icon: <ShieldCheck className="h-5 w-5 text-blue-400" />,
            status: "complete"
        }
    ];

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    {t.timeline.title}
                    <span className="text-xs font-normal text-muted-foreground">{t.timeline.span}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-x-auto pb-6 custom-scrollbar">
                <div className="relative min-w-[800px] px-4">
                    {/* Connecting line */}
                    <div className="absolute top-[2.25rem] left-10 right-10 h-0.5 bg-gradient-to-r from-indigo-500/50 via-emerald-500/30 to-transparent z-0" />

                    <div className="grid grid-cols-4 gap-4 relative">
                        {GROWTH_MILESTONES.map((milestone, idx) => (
                            <div key={idx} className="flex flex-col gap-3 items-center text-center group">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-transform group-hover:scale-110 relative z-10 ${milestone.status === 'current' ? 'ring-2 ring-indigo-500/50 border-indigo-500/50' : ''
                                    }`}>
                                    {milestone.status === 'complete' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : milestone.icon}
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{milestone.date}</span>
                                        {milestone.status === 'current' && (
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight px-2">{milestone.title}</h3>
                                    <p className="text-[11px] text-muted-foreground leading-snug italic max-w-[150px]">
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
