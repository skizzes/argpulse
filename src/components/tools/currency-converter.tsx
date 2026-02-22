"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, DollarSign } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

interface ExchangeRates {
    oficial?: { sell: number };
    blue?: { sell: number };
    bolsa?: { sell: number };
    contadoConLiqui?: { sell: number };
}

const RATE_CONFIG = [
    { key: "oficial", label: "Oficial", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { key: "blue", label: "Blue", color: "text-sky-500", bg: "bg-sky-500/10" },
    { key: "bolsa", label: "MEP", color: "text-purple-500", bg: "bg-purple-500/10" },
    { key: "contadoConLiqui", label: "CCL", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export function CurrencyConverter({ rates }: { rates?: ExchangeRates }) {
    const { locale } = useLanguage();
    const [amount, setAmount] = useState<string>("100");
    const [direction, setDirection] = useState<"usd_to_ars" | "ars_to_usd">("usd_to_ars");

    const numAmount = parseFloat(amount) || 0;

    const getRateValue = (key: string): number => {
        if (!rates) return 0;
        const rate = (rates as any)[key];
        return rate?.sell || 0;
    };

    const convert = (rate: number): string => {
        if (rate === 0) return "—";
        if (direction === "usd_to_ars") {
            return (numAmount * rate).toLocaleString(locale === "es" ? "es-AR" : "en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            });
        }
        return (numAmount / rate).toLocaleString(locale === "es" ? "es-AR" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const fromCurrency = direction === "usd_to_ars" ? "USD" : "ARS";
    const toCurrency = direction === "usd_to_ars" ? "ARS" : "USD";

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-bold">
                            {locale === "es" ? "Conversor de Moneda" : "Currency Converter"}
                        </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-400">
                        {locale === "es" ? "EN VIVO" : "LIVE RATES"}
                    </Badge>
                </div>

                {/* Input Row */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            {fromCurrency}
                        </span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="100"
                        />
                    </div>
                    <button
                        onClick={() => setDirection(d => d === "usd_to_ars" ? "ars_to_usd" : "usd_to_ars")}
                        className="shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-all hover:rotate-180 duration-500"
                    >
                        <ArrowRightLeft className="h-4 w-4 text-primary" />
                    </button>
                    <div className="w-12 text-center">
                        <span className="text-xs font-bold text-muted-foreground">{toCurrency}</span>
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-2">
                    {RATE_CONFIG.map((cfg) => {
                        const rate = getRateValue(cfg.key);
                        if (rate === 0) return null;
                        return (
                            <div
                                key={cfg.key}
                                className={`${cfg.bg} rounded-xl p-3 border border-border/20 transition-all hover:scale-[1.02]`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {cfg.label}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground">
                                        ${rate.toLocaleString()}
                                    </span>
                                </div>
                                <span className={`text-lg font-black ${cfg.color}`}>
                                    {direction === "usd_to_ars" ? "$" : "US$"}{convert(rate)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <p className="text-[9px] text-center text-muted-foreground italic">
                    {locale === "es"
                        ? "Cotización venta. Informativo, no transaccional."
                        : "Sell rate. Informational, not transactional."}
                </p>
            </CardContent>
        </Card>
    );
}
