"use client";

import { IndicatorCard } from "@/components/indicators/indicator-card";
import { useLanguage } from "@/components/shared/language-context";

interface BlueRate {
    buy: number;
    sell: number;
    updatedAt?: string;
}

export function DollarBlueContent({ blueRate, history }: { blueRate: BlueRate; history: { date: string; value: number }[] }) {
    const { t } = useLanguage();

    const chartData = history.length > 0
        ? history.slice(-30).map(h => ({ date: h.date, value: h.value }))
        : Array.from({ length: 12 }).map((_, i) => ({
            date: `Day ${i + 1}`,
            value: (blueRate.sell || 1100) + Math.random() * 100
        }));

    const buyPrice = blueRate.buy ? `$${blueRate.buy.toLocaleString()}` : '—';
    const sellPrice = blueRate.sell ? `$${blueRate.sell.toLocaleString()}` : '—';

    return (
        <main className="flex-1 container mx-auto max-w-4xl px-4 md:px-8 py-12 space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {t.dollarBlue.heading}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {t.dollarBlue.description}
                </p>
            </div>

            <div className="max-w-md">
                <IndicatorCard
                    title="USD Blue"
                    value={sellPrice}
                    change={blueRate.updatedAt ? new Date(blueRate.updatedAt).toLocaleDateString() : '—'}
                    trend="good_down"
                    chartData={chartData}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="bg-card p-6 rounded-xl border border-border/50">
                    <h3 className="font-bold text-lg mb-2">{t.dollarBlue.buy}</h3>
                    <p className="text-3xl font-black text-green-500">{buyPrice}</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/50">
                    <h3 className="font-bold text-lg mb-2">{t.dollarBlue.sell}</h3>
                    <p className="text-3xl font-black text-red-500">{sellPrice}</p>
                </div>
            </div>

            <div className="prose prose-invert max-w-none mt-12">
                <h2>{t.dollarBlue.whatIs}</h2>
                <p>{t.dollarBlue.whatIsText}</p>

                <h2>{t.dollarBlue.whyImportant}</h2>
                <p>{t.dollarBlue.whyImportantText}</p>
            </div>
        </main>
    );
}
