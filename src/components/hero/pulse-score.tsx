"use client";

import { useState, useMemo } from "react";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus, Activity, CalendarClock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SharePulseButton } from "@/components/shared/share-button";
import { useLanguage } from "@/components/shared/language-context";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

interface PulseScoreProps {
    score: number;
    previousScore: number;
    lastUpdated: string;
    explanation: string;
}

export function PulseScore({
    score,
    previousScore,
    lastUpdated,
    explanation,
}: PulseScoreProps) {
    const { t, locale } = useLanguage();
    const [projectionMonths, setProjectionMonths] = useState<number>(0);

    // Generate 24 months of data: 12 months history + 12 months projection
    const chartData = useMemo(() => {
        const data = [];
        const now = new Date();

        // 1. History: 12 months backwards (from -12 to -1)
        for (let i = 12; i >= 1; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const dateStr = d.toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-US', { month: 'short', year: '2-digit' });
            // Semi-realistic historical volatility
            const historicalVal = 44 + (Math.sin(i * 0.4) * 3) + (12 - i) * 0.2;
            data.push({
                date: dateStr,
                value: historicalVal,
                isProjection: false
            });
        }

        // 2. Current: month 0
        data.push({
            date: now.toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-US', { month: 'short', year: '2-digit' }),
            value: score,
            isProjection: false
        });

        // 3. Projection: 12 months forward (from 1 to 12)
        // This part updates based on projectionMonths slider
        for (let i = 1; i <= 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const dateStr = d.toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-US', { month: 'short', year: '2-digit' });

            // Slower, more realistic projection curve (diminishing returns)
            const growthFactor = 0.75; // Slower growth per month
            const projectedVal = score + (Math.sqrt(i) * growthFactor * projectionMonths / 4);

            data.push({
                date: dateStr,
                value: i <= projectionMonths ? projectedVal : null, // only show up to slider
                displayValue: i <= projectionMonths ? projectedVal : null,
                isProjection: true
            });
        }
        return data;
    }, [score, projectionMonths, locale]);

    const displayedScore = Math.min(100, score + (Math.sqrt(projectionMonths) * 0.75 * projectionMonths / 4));

    const difference = displayedScore - score;
    const isUp = difference > 0.01;
    const isDown = difference < -0.01;

    // Determine color based on score
    let scoreColor = "text-emerald-500";
    if (displayedScore < 45) scoreColor = "text-rose-500";
    else if (displayedScore < 55) scoreColor = "text-amber-500";

    return (
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card to-muted/20 shadow-xl relative">
            {/* Background Graphic Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <CardHeader className="border-b border-border/50 bg-card/40 backdrop-blur-sm pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black tracking-tighter flex items-center gap-3">
                            <Activity className="h-8 w-8 text-primary animate-pulse" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {t.hero.title}
                            </span>
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-muted-foreground/80">
                            {t.hero.subtitle}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{t.hero.sentiment}</span>
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold">
                                {t.hero.bullish}
                            </Badge>
                        </div>
                        <SharePulseButton score={displayedScore} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Left: Financial HUD */}
                    <div className="lg:col-span-4 p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/50 bg-card/60">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <h2 className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                                {projectionMonths === 0 ? t.hero.liveEdge : t.hero.forward.replace('{months}', projectionMonths.toString())}
                            </h2>
                        </div>

                        <div className="flex items-baseline gap-4 mt-2">
                            <motion.span
                                key={projectionMonths}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`text-9xl font-black tracking-tighter drop-shadow-md ${scoreColor}`}
                            >
                                {displayedScore.toFixed(1)}
                            </motion.span>
                            <span className="text-4xl font-bold text-muted-foreground/30">/100</span>
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <Badge
                                variant={isUp ? "success" : isDown ? "destructive" : "secondary"}
                                className="text-lg px-4 py-1.5 flex items-center gap-1.5 font-black shadow-sm"
                            >
                                {isUp ? <ArrowUpRight className="h-5 w-5" /> : isDown ? <ArrowDownRight className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                                {Math.abs(difference).toFixed(1)} pts
                            </Badge>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-tight">
                                    {t.hero.delta}
                                </span>
                                <span className="text-sm font-medium">
                                    {projectionMonths > 0 ? t.hero.vsLive : t.hero.vsPrev}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Interactive Predictive Chart */}
                    <div className="lg:col-span-8 p-0 flex flex-col min-h-[400px]">

                        {/* The Large Chart Section */}
                        <div className="flex-1 p-6 pb-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    {t.hero.visualizer}
                                </h3>
                                <div className="flex gap-4 text-[10px] font-bold">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> {t.hero.record}</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/30 border border-primary/50 border-dashed" /> {t.hero.forecast}</div>
                                </div>
                            </div>

                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }}
                                            interval={2}
                                        />
                                        <YAxis
                                            domain={[30, 90]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'black', border: '1px solid #333', borderRadius: '8px' }}
                                            labelStyle={{ color: '#888', fontWeight: 'bold' }}
                                            itemStyle={{ color: 'white' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--primary)"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                            animationDuration={1000}
                                        />
                                        {/* Divider between history and projection */}
                                        <ReferenceLine x={chartData[12].date} stroke="#888" strokeDasharray="3 3" label={{ value: 'NOW', position: 'top', fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Control & Details Bar */}
                        <div className="p-8 pt-4 border-t border-border/50 bg-muted/10">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-full max-w-md space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold uppercase tracking-tighter">{t.hero.horizon}</span>
                                        </div>
                                        <span className="text-xl font-black text-primary">{projectionMonths}M</span>
                                    </div>

                                    <SliderPrimitive.Root
                                        className="relative flex items-center select-none touch-none w-full h-5"
                                        value={[projectionMonths]}
                                        onValueChange={(vals) => setProjectionMonths(vals[0])}
                                        max={12}
                                        step={1}
                                        aria-label="Projection Months"
                                    >
                                        <SliderPrimitive.Track className="bg-muted relative grow rounded-full h-3 overflow-hidden border border-border/30">
                                            <SliderPrimitive.Range className="absolute bg-primary h-full" />
                                        </SliderPrimitive.Track>
                                        <SliderPrimitive.Thumb className="block w-6 h-6 bg-background border-4 border-primary shadow-lg rounded-full hover:scale-125 transition-transform cursor-grab active:cursor-grabbing focus:outline-none" />
                                    </SliderPrimitive.Root>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {projectionMonths === 0
                                            ? t.hero.stableText
                                            : t.hero.modelingText
                                                .replace('{months}', projectionMonths.toString())
                                                .replace('{pts}', (displayedScore - score).toFixed(1))}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {t.hero.computeSync.replace('{time}', lastUpdated)}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
