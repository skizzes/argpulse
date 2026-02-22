"use client";

import { useState, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Cell,
    Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Calendar, Zap } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

interface InflationDataPoint {
    date: string;
    value: number;
    month: string;
}

/**
 * Historical Inflation Area Chart
 */
export function InflationHistoryChart({ data }: { data: InflationDataPoint[] }) {
    const { t, locale } = useLanguage();
    const [range, setRange] = useState<string>("4Y");

    const filteredData = useMemo(() => {
        if (range === "MAX") return data;
        const months = range === "6M" ? 6 : range === "1Y" ? 12 : 48;
        return data.slice(-months);
    }, [data, range]);

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-primary" />
                            {t.inflation.history}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'es' ? 'Variación porcentual mensual del Índice de Precios al Consumidor.' : 'Monthly percentage variation of the Consumer Price Index.'}
                        </CardDescription>
                    </div>
                    <div className="flex items-center bg-muted/20 p-1 rounded-lg border border-border/50 h-fit">
                        {["6M", "1Y", "4Y", "MAX"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${range === r
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIpc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }}
                                interval={Math.max(0, Math.floor(filteredData.length / 8))}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'black', border: '1px solid #333', borderRadius: '8px' }}
                                labelStyle={{ color: '#888', fontWeight: 'bold' }}
                                itemStyle={{ color: 'white' }}
                                formatter={(val: any) => [`${val.toFixed(1)}%`, 'Monthly IPC']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIpc)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Presidential Term Comparison Chart (Cumulative)
 * Note: These values would ideally be calculated from the series data.
 */
export function PresidentialComparisonChart() {
    const { t, locale } = useLanguage();
    const data = [
        { name: "M. Macri", years: "2015-19", value: 295, color: "#facc15", text: "text-yellow-500" },
        { name: "A. Fernández", years: "2019-23", value: 814, color: "#3b82f6", text: "text-blue-500" },
        { name: "J. Milei", years: "2023-Present", value: 145, color: "#a855f7", text: "text-purple-500" }
    ];

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    {t.inflation.comparison}
                </CardTitle>
                <CardDescription>
                    {locale === 'es' ? 'Impacto acumulado secuencial por administración.' : 'Sequential cumulative impact per administration.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mt-12 mb-8 px-4">
                    {/* The Timeline Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/30 -translate-y-1/2" />

                    <div className="flex justify-between relative">
                        {data.map((p, i) => (
                            <div key={p.name} className="flex flex-col items-center relative group">
                                {/* Value popup */}
                                <div className="absolute -top-12 flex flex-col items-center transition-transform group-hover:-translate-y-1">
                                    <span className={`text-lg font-black tracking-tighter ${p.text}`}>{p.value}%</span>
                                    <div className="h-1 w-1 rounded-full bg-border" />
                                </div>

                                {/* Timeline Node */}
                                <div
                                    className="w-4 h-4 rounded-full bg-background border-2 z-10 transition-all group-hover:scale-125"
                                    style={{ borderColor: p.color, boxShadow: `0 0 10px ${p.color}40` }}
                                />

                                {/* Label Section */}
                                <div className="absolute -bottom-10 flex flex-col items-center text-center w-32">
                                    <span className="text-[10px] font-black uppercase text-foreground/80">{p.name}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap">{p.years}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-border/20 text-[9px] text-muted-foreground uppercase font-bold text-center italic">
                    * Values adjusted to current series benchmark. Milei period is ongoing.
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Inflation Summary Cards Matrix
 */
export function InflationSummaryCards({ current, ytd, yoy }: { current: number, ytd: number, yoy: number }) {
    const { t } = useLanguage();
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t.inflation.title}</h2>
                    <p className="text-sm text-muted-foreground">{t.inflation.subtitle}</p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-xs uppercase tracking-widest font-bold">
                        {t.inflation.latest.replace('{val}', current.toFixed(1))}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-primary">{t.inflation.monthly}</CardDescription>
                        <CardTitle className="text-4xl font-black">{current.toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5">
                            <TrendingDown className="h-3 w-3 mr-1" /> {t.inflation.decelerating}
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="bg-muted/10 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-widest">{t.inflation.ytd}</CardDescription>
                        <CardTitle className="text-4xl font-black text-muted-foreground">{ytd.toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {t.inflation.cumulative}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/10 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-widest">{t.inflation.yoy}</CardDescription>
                        <CardTitle className="text-4xl font-black text-muted-foreground">{yoy.toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            {t.inflation.rolling}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
