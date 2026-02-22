"use client";

import { useState } from "react";
import { useMemo } from "react";
import { IndicatorCard, type IndicatorData } from "./indicator-card";
import { IndicatorModal } from "./indicator-modal";
import { useLanguage } from "@/components/shared/language-context";

// Mock data generator for 12 months
const generateMockChart = (base: number, volatility: number, trend: number, allowNegative: boolean = true) => {
    let current = base;
    const now = new Date();

    return Array.from({ length: 12 }).map((_, i) => {
        // i goes from 0 to 11. 11 - i means months ago
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        current = current + (Math.random() * volatility * 2 - volatility) + trend;
        return { date: dateStr, value: allowNegative ? current : Math.max(0, current) };
    });
};

const MOCK_INDICATORS: IndicatorData[] = [
    {
        title: "Inflation (Monthly)",
        value: "2.8%",
        change: "-0.2%",
        trend: "good_down",
        chartData: generateMockChart(12, 1, -0.6)
    },
    {
        title: "USD Official",
        value: "$1,040",
        change: "+$20",
        trend: "bad_up",
        chartData: generateMockChart(850, 5, 20, false)
    },
    {
        title: "USD Blue",
        value: "$1,180",
        change: "-$5",
        trend: "good_down",
        chartData: generateMockChart(1200, 15, -2, false)
    },
    {
        title: "USD MEP",
        value: "$1,120",
        change: "+$2",
        trend: "neutral",
        chartData: generateMockChart(1100, 10, 2, false)
    },
    {
        title: "Int. Reserves",
        value: "$29.5B",
        change: "+$120M",
        trend: "up",
        chartData: generateMockChart(26, 0.5, 0.3, false)
    },
    {
        title: "Country Risk",
        value: "1,250 pts",
        change: "-25 pts",
        trend: "good_down",
        chartData: generateMockChart(1900, 50, -60)
    },
    {
        title: "Unemployment",
        value: "7.6%",
        change: "+0.1%",
        trend: "bad_up",
        chartData: generateMockChart(6.5, 0.2, 0.1)
    },
    {
        title: "EMAE Activity",
        value: "-3.2%",
        change: "+1.1%",
        trend: "up",
        chartData: generateMockChart(-5, 0.5, 0.2)
    }
];

export function IndicatorsGrid({ liveData }: { liveData?: any }) {
    const { t, locale } = useLanguage();
    const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData | null>(null);

    // Calculate freshness from the most recent data point
    const freshness = useMemo(() => {
        if (!liveData?.risk?.updatedAt) return null;
        const updated = new Date(liveData.risk.updatedAt);
        const now = new Date();
        const diffMin = Math.round((now.getTime() - updated.getTime()) / 60000);
        if (diffMin < 60) return locale === 'es' ? `Actualizado hace ${diffMin}min` : `Updated ${diffMin}min ago`;
        const diffHrs = Math.round(diffMin / 60);
        return locale === 'es' ? `Actualizado hace ${diffHrs}h` : `Updated ${diffHrs}h ago`;
    }, [liveData, locale]);

    // Merge live data with our baseline mock indicators
    const indicators = useMemo(() => {
        const merged = [...MOCK_INDICATORS];

        if (liveData?.rates) {
            // Update Official USD
            const official = merged.find(i => i.title.includes("Official"));
            if (official && liveData.rates.oficial) {
                official.value = `$${liveData.rates.oficial.sell.toFixed(2)}`;
                official.change = "+0.2%";
                official.trend = "bad_up";
                if (liveData.rates.oficial.history) {
                    official.chartData = liveData.rates.oficial.history;
                } else {
                    official.chartData[official.chartData.length - 1].value = liveData.rates.oficial.sell;
                }
            }

            // Update Blue USD
            const blue = merged.find(i => i.title.includes("Blue"));
            if (blue && liveData.rates.blue) {
                blue.value = `$${liveData.rates.blue.sell.toFixed(0)}`;
                blue.change = "-1.5%";
                blue.trend = "good_down";
                if (liveData.rates.blue.history) {
                    blue.chartData = liveData.rates.blue.history;
                } else {
                    blue.chartData[blue.chartData.length - 1].value = liveData.rates.blue.sell;
                }
            }

            // Update MEP USD
            const mep = merged.find(i => i.title.includes("MEP"));
            if (mep && liveData.rates.bolsa) {
                mep.value = `$${liveData.rates.bolsa.sell.toFixed(0)}`;
                mep.change = "+0.3%";
                mep.trend = "neutral";
                if (liveData.rates.bolsa.history) {
                    mep.chartData = liveData.rates.bolsa.history;
                } else {
                    mep.chartData[mep.chartData.length - 1].value = liveData.rates.bolsa.sell;
                }
            }
        }

        if (liveData?.risk) {
            const risk = merged.find(i => i.title.includes("Risk"));
            if (risk && liveData.risk.value) {
                risk.value = `${liveData.risk.value} pts`;
                risk.change = "-25 pts";
                risk.trend = "good_down";
                risk.chartData[risk.chartData.length - 1].value = liveData.risk.value;
            }
        }

        if (liveData?.reserves) {
            const res = merged.find(i => i.title.includes("Reserves"));
            if (res && liveData.reserves.value) {
                const bVal = liveData.reserves.value / 1000;
                res.value = `$${bVal.toFixed(1)}B`;
                res.change = "+$45M";
                res.trend = "up";
                res.chartData[res.chartData.length - 1].value = bVal;
            }
        }

        if (liveData?.inflation) {
            const inf = merged.find(i => i.title.includes("Inflation"));
            if (inf && liveData.inflation.value) {
                inf.value = `${liveData.inflation.value.toFixed(1)}%`;
                inf.change = "-0.4%";
                inf.trend = "good_down";
                inf.chartData[inf.chartData.length - 1].value = liveData.inflation.value;
            }
        }

        return merged;
    }, [liveData]);

    return (
        <div className="space-y-6 lg:mt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t.indicators.title}</h2>
                    <p className="text-sm text-muted-foreground">{t.indicators.subtitle}</p>
                </div>
                {freshness && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {freshness}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {indicators.map((indicator) => {
                    // Localize title if possible
                    let displayTitle = indicator.title;
                    if (indicator.title.includes("Inflation")) displayTitle = t.inflation.monthly;
                    if (indicator.title.includes("Official")) displayTitle = `USD ${t.indicators.official}`;
                    if (indicator.title.includes("Blue")) displayTitle = "USD Blue";
                    if (indicator.title.includes("MEP")) displayTitle = "USD MEP";
                    if (indicator.title.includes("Reserves")) displayTitle = t.strategic.cepo;
                    if (indicator.title.includes("Risk")) displayTitle = "Riesgo País";
                    if (indicator.title.includes("Unemployment")) displayTitle = "Desempleo";
                    if (indicator.title.includes("EMAE")) displayTitle = "Actividad EMAE";

                    return (
                        <div
                            key={indicator.title}
                            onClick={() => setSelectedIndicator({ ...indicator, title: displayTitle })}
                            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <IndicatorCard {...indicator} title={displayTitle} />
                        </div>
                    );
                })}
            </div>

            <IndicatorModal
                indicator={selectedIndicator}
                isOpen={!!selectedIndicator}
                onClose={() => setSelectedIndicator(null)}
            />
        </div>
    );
}
