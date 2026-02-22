"use client";

import { useLanguage } from "@/components/shared/language-context";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    InflationHistoryChart,
    PresidentialComparisonChart,
    InflationSummaryCards
} from "@/components/indicators/inflation-charts";

interface InflationPageContentProps {
    hasData: boolean;
    sortedSeries: { date: string; value: number; month: string }[];
    currentVal: number;
    ytdVal: number;
    yoyVal: number;
    latestMonth: string;
}

export function InflationPageContent({
    hasData,
    sortedSeries,
    currentVal,
    ytdVal,
    yoyVal,
    latestMonth,
}: InflationPageContentProps) {
    const { t } = useLanguage();

    if (!hasData) {
        return (
            <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold">{t.inflationPage.unavailable}</h1>
                <p className="text-muted-foreground text-center max-w-md mt-2">
                    {t.inflationPage.unavailableText}
                </p>
            </main>
        );
    }

    return (
        <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-12 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-2 py-0 font-bold tracking-tight">{t.inflationPage.badge}</Badge>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{t.inflationPage.frequency}</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        {t.inflationPage.heading}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                        {t.inflationPage.description}
                    </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-2xl font-black">
                        {t.inflationPage.reading.replace('{month}', latestMonth)}
                    </span>
                    <div className="flex items-center gap-2 text-sm font-bold text-green-500">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {t.inflationPage.liveSync}
                    </div>
                </div>
            </div>

            {/* Primary Indicators Grid */}
            <InflationSummaryCards
                current={currentVal}
                ytd={ytdVal}
                yoy={yoyVal}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Historical Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <InflationHistoryChart data={sortedSeries.slice(-48)} />

                    <Card className="bg-muted/10 border-border/30">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl h-fit">
                                    <Info className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg">{t.inflationPage.insight}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t.inflationPage.insightText}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Analytical Section */}
                <div className="lg:col-span-1 space-y-8">
                    <PresidentialComparisonChart />

                    <div className="p-6 rounded-2xl border border-border/50 bg-gradient-to-b from-card to-muted/20 space-y-4">
                        <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">{t.inflationPage.contextual}</h3>
                        <div className="space-y-4">
                            <section>
                                <h4 className="text-sm font-black mb-1">{t.inflationPage.fiscal}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed italic">
                                    {t.inflationPage.fiscalText}
                                </p>
                            </section>
                            <section className="pt-4 border-t border-border/30">
                                <h4 className="text-sm font-black mb-1">{t.inflationPage.consensus}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t.inflationPage.consensusText}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
