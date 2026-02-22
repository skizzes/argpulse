"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/components/shared/language-context";

interface ADR {
    ticker: string;
    price: number;
    change: string;
    trend: 'up' | 'down' | 'neutral';
}

interface MarketData {
    merval: {
        value: number;
        change: string;
        trend: 'up' | 'down' | 'neutral';
        history?: { date: string, value: number }[];
    };
    adr: ADR[];
}

// Generate some mock history if not present for the chart
const mockMervalHistory = Array.from({ length: 12 }).map((_, i) => ({
    date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    value: 1100000 + Math.random() * 200000 + (i * 15000)
}));

export function CapitalMarkets({ data }: { data?: MarketData }) {
    const { t, locale } = useLanguage();

    if (!data) {
        return (
            <div className="space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg min-h-[220px]">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-48 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-40 mb-4" />
                            <Skeleton className="h-[120px] w-full rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="px-0 space-y-0">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-3">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const mervalHistory = data.merval.history || mockMervalHistory;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{t.markets.title}</h2>
                <p className="text-sm text-muted-foreground">{t.markets.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MERVAL Card */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col min-h-[220px]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                S&P MERVAL
                                <Badge variant="outline" className="text-[10px] py-0 h-4 uppercase tracking-tighter">
                                    {locale === 'es' ? 'Mercado Directo' : 'Direct Market'}
                                </Badge>
                            </div>
                            <span className={`text-sm font-medium flex items-center ${data.merval.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                {data.merval.change}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            {locale === 'es' ? 'Principal índice bursátil argentino' : 'Main Argentine stock index'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between p-0">
                        <div className="px-6 pb-2">
                            <div className="text-3xl font-bold tracking-tighter">
                                {data.merval.value.toLocaleString()}
                            </div>
                        </div>

                        {/* Main Chart with Context */}
                        <div className="h-[120px] w-full mt-auto px-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mervalHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="mervalGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" opacity={0.05} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#888' }}
                                        interval={2}
                                    />
                                    <YAxis
                                        domain={['dataMin - 50000', 'dataMax + 50000']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: '#888' }}
                                        tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                                        itemStyle={{ color: '#22c55e' }}
                                        labelStyle={{ color: '#888' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#mervalGradient)"
                                        isAnimationActive={true}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* ADRs List */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">
                            {locale === 'es' ? 'ADRs Argentinos (NYC)' : 'Argentine ADRs (NYC)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="divide-y divide-border/30">
                            {data.adr.map((stock) => (
                                <div key={stock.ticker} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-widest">{stock.ticker}</span>
                                        <span className="text-xs text-muted-foreground">NYSE / NASDAQ</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="font-mono font-medium">${stock.price.toFixed(2)}</span>
                                        <span className={`text-xs font-semibold ${stock.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                                            }`}>
                                            {stock.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
