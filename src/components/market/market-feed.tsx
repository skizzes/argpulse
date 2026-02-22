"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

export function MarketFeed() {
    const { locale } = useLanguage();

    const MARKET_DATA = [
        {
            label: locale === 'es' ? "MERVAL (ARS)" : "MERVAL (ARS)",
            value: "1,245,600",
            change: "+1.2%",
            trend: "up"
        },
        {
            label: locale === 'es' ? "Bono AL30 (USD)" : "AL30 Bond (USD)",
            value: "$54.20",
            change: "+0.5%",
            trend: "up"
        },
        {
            label: locale === 'es' ? "Brecha Cambiaria" : "USD Spread (Brecha)",
            value: "13.4%",
            change: "-2.1%",
            trend: "down"
        },
        {
            label: locale === 'es' ? "Reservas Semanales" : "Weekly Reserves",
            value: "+$120M",
            change: locale === 'es' ? "Acumulando" : "Accumulating",
            trend: "up"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MARKET_DATA.map((item, i) => {
                const isUp = item.trend === "up";
                const isDown = item.trend === "down";
                // Context-aware color (e.g., Brecha going down is good for stability)
                const isGood = isUp || (item.label.includes("Brecha") || item.label.includes("Spread") && isDown);

                return (
                    <Card key={i} className="hover:border-foreground/20 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                <p className="text-xl font-bold mt-1">{item.value}</p>
                            </div>
                            <div className={`flex flex-col items-end ${isGood ? 'text-green-500' : 'text-red-500'}`}>
                                <div className="flex items-center gap-1 font-semibold text-sm">
                                    {isUp ? <TrendingUp className="h-4 w-4" /> : isDown ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                    {item.change}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
