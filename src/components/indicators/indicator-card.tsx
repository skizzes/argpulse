"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, YAxis } from "recharts";

export interface IndicatorData {
    title: string;
    value: string;
    change: string;
    changeAmount?: number;
    trend: "up" | "down" | "neutral" | "bad_up" | "good_down"; // e.g. inflation going down is good 
    chartData: { date: string; value: number }[];
}

export function IndicatorCard({
    title,
    value,
    change,
    trend,
    chartData,
}: IndicatorData) {
    // Determine colors based on trend
    const isPositive = trend === "up" || trend === "good_down";
    const isNegative = trend === "down" || trend === "bad_up";

    const iconColor = isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500";
    const chartColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#6b7280";

    return (
        <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`p-1 bg-muted/50 rounded-full ${iconColor}`}>
                    {trend === "up" || trend === "bad_up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                    ) : trend === "down" || trend === "good_down" ? (
                        <ArrowDownRight className="h-4 w-4" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-2xl font-bold tracking-tight">{value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className={`font-semibold ${iconColor}`}>{change}</span>{" "}
                            vs prev
                        </p>
                    </div>

                    <div className="h-[40px] w-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <YAxis domain={['dataMin', 'dataMax']} hide />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColor}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
