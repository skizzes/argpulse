import { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getInflationSeries } from "@/lib/api";
import { InflationPageContent } from "./content";

export const metadata: Metadata = {
    title: "Argentina Inflation Rate (IPC) Today | ARGPULSE",
    description: "Track the latest official inflation statistics for Argentina. Live charts, historical context, and economic analysis.",
};

export default async function InflationPage() {
    const series = await getInflationSeries();

    // Sort series chronologically
    const sortedSeries = series
        ? [...series].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [];

    // Latest monthly IPC
    const latest = sortedSeries.length > 0
        ? sortedSeries[sortedSeries.length - 1]
        : { value: 0, month: '—', date: new Date().toISOString() };

    // Calculate YTD and YoY
    let yoyVal = 208.7;
    let ytdVal = 44.2;

    if (sortedSeries.length >= 13) {
        const last12 = sortedSeries.slice(-12);
        const product = last12.reduce((acc, curr) => acc * (1 + curr.value / 100), 1);
        yoyVal = (product - 1) * 100;

        const currentYear = new Date(latest.date).getFullYear();
        const thisYearData = sortedSeries.filter(d => new Date(d.date).getFullYear() === currentYear);
        const ytdProduct = thisYearData.reduce((acc, curr) => acc * (1 + curr.value / 100), 1);
        ytdVal = (ytdProduct - 1) * 100;
    }

    return (
        <>
            <Navbar />
            <InflationPageContent
                hasData={sortedSeries.length > 0}
                sortedSeries={sortedSeries}
                currentVal={latest.value}
                ytdVal={ytdVal}
                yoyVal={yoyVal}
                latestMonth={(latest as any).month || '—'}
            />
            <Footer />
        </>
    );
}
