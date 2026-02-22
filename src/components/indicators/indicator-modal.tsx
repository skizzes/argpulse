"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { IndicatorData } from "./indicator-card";

interface IndicatorModalProps {
    indicator: IndicatorData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function IndicatorModal({ indicator, isOpen, onClose }: IndicatorModalProps) {
    if (!indicator) return null;

    const isPositive = indicator.trend === "up" || indicator.trend === "good_down";
    const isNegative = indicator.trend === "down" || indicator.trend === "bad_up";

    const iconColor = isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500";
    const chartColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#6b7280";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl bg-card border-border/50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        {indicator.title}
                        <div className={`p-1.5 bg-muted/50 rounded-full ${iconColor} bg-opacity-20`}>
                            {indicator.trend === "up" || indicator.trend === "bad_up" ? (
                                <ArrowUpRight className="h-5 w-5" />
                            ) : indicator.trend === "down" || indicator.trend === "good_down" ? (
                                <ArrowDownRight className="h-5 w-5" />
                            ) : (
                                <Minus className="h-5 w-5" />
                            )}
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Historical data overview for the last 12 periods.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 mt-4 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Current Value</p>
                        <div className="text-4xl font-black tracking-tighter">{indicator.value}</div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Change vs Previous</p>
                        <div className={`text-xl font-bold ${iconColor}`}>{indicator.change}</div>
                    </div>
                </div>

                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={indicator.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`gradient-modal-${indicator.title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                itemStyle={{ color: '#fafafa', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#gradient-modal-${indicator.title.replace(/\s+/g, '-')})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
}
