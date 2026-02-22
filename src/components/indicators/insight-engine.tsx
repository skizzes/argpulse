"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, ShieldCheck, Landmark, Map, TrendingUp, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

export function InsightEngine() {
    const { t, locale } = useLanguage();
    // Strategic Data for Feb 2026
    const oilProduction = 610715; // bpd record
    const gasProduction = 91.28; // million m3/day
    const reservesGap = 16320; // Millions needed for the +10B target
    const currentNetReserves = -9856; // Millions
    const recoveryTarget = 10000; // Millions

    // Calculate Cepo Progress
    // We treat -$10B as 0% and +$10B as 100% for the "Lifting CEPO" threshold
    const totalPath = 20000; // From -10k to +10k
    const progressed = currentNetReserves + 10000;
    const cepoProgress = Math.max(0, Math.min(100, (progressed / totalPath) * 100));

    return (
        <section id="strategic-insight" className="w-full space-y-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-sky-500" />
                        {t.strategic.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{t.strategic.subtitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Vaca Muerta Tracker */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">{t.hero.record}</Badge>
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider mt-2">{t.strategic.vacaMuerta}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-foreground">610.7k</span>
                                <span className="text-[10px] font-bold text-muted-foreground mb-1">BPD OIL</span>
                            </div>
                            <Progress value={92} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground">+32% Year-over-Year growth</p>
                        </div>
                        <div className="pt-2 border-t border-border/20">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-muted-foreground">Gas Production</span>
                                <span className="font-bold">91.3M m³/d</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cepo Lifting Tracker */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <Landmark className={`h-12 w-12 opacity-5 ${cepoProgress > 70 ? 'text-emerald-500' : 'text-sky-500'}`} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{t.strategic.cepo}</CardTitle>
                        <CardDescription className="text-[10px]">{t.strategic.cepoDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground italic">Target: +$10B</span>
                                <span className="text-sm font-black text-sky-500">{cepoProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-sky-500 transition-all duration-1000"
                                    style={{ width: `${cepoProgress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] items-center">
                                <span className="text-rose-400 font-bold">Current: -$9.8B</span>
                                <div className="flex items-center gap-1 text-emerald-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>Buying Daily</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Institutional Health */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                    <CardHeader className="pb-2 text-center">
                        <CardTitle className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">{t.strategic.health}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-2 space-y-3">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                            <svg className="h-full w-full transform -rotate-90">
                                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" strokeDasharray="201" strokeDashoffset={201 - (46 / 100) * 201} strokeLinecap="round" fill="transparent" className="text-indigo-500" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black">46%</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase">Approval</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-2 text-center">
                            <div className="bg-background/40 p-1.5 rounded-md border border-border/20">
                                <span className="block text-[8px] text-muted-foreground uppercase font-bold">Confidence</span>
                                <span className="text-[10px] font-black">HIGH</span>
                            </div>
                            <div className="bg-background/40 p-1.5 rounded-md border border-border/20">
                                <span className="block text-[8px] text-muted-foreground uppercase font-bold">Stability</span>
                                <span className="text-[10px] font-black text-emerald-500">SOLID</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Provincial Fiscal Pulse */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <Map className="h-4 w-4 text-orange-500" />
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">DEFICIT ZERO</span>
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider mt-1">{t.strategic.provincial}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/20">
                            {[
                                { name: "CABA", status: locale === 'es' ? 'Superávit' : 'Surplus', color: "text-emerald-500" },
                                { name: "Mendoza", status: locale === 'es' ? 'Superávit' : 'Surplus', color: "text-emerald-500" },
                                { name: "Córdoba", status: locale === 'es' ? 'Equilibrio' : 'Equilibrium', color: "text-sky-500" },
                                { name: "Buenos Aires", status: locale === 'es' ? 'Déficit' : 'Deficit', color: "text-rose-500" },
                            ].map((prov) => (
                                <div key={prov.name} className="flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors">
                                    <span className="text-[11px] font-medium">{prov.name}</span>
                                    <span className={`text-[10px] font-black italic uppercase ${prov.color}`}>{prov.status}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-xl flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight text-sky-400">{t.strategic.forecastNote}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {t.strategic.forecastText}
                    </p>
                </div>
            </div>
        </section>
    );
}
