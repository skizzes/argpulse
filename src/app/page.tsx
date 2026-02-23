import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PulseScore } from "@/components/hero/pulse-score";
import { IndicatorsGrid } from "@/components/indicators/indicators-grid";
import { CapitalMarkets } from "@/components/market/capital-markets";
import { GrowthTimeline } from "@/components/market/growth-timeline";
import { NewsHub } from "@/components/news/news-hub";
import { GovFeed } from "@/components/social/gov-feed";
import { WeeklyPoll } from "@/components/social/weekly-poll";
import { CurrencyConverter } from "@/components/tools/currency-converter";
import { SentimentThermometer } from "@/components/indicators/sentiment-thermometer";
import { InsightEngine } from "@/components/indicators/insight-engine";
import { AdBanner } from "@/components/shared/ad-banner";
import {
  InflationHistoryChart,
  PresidentialComparisonChart,
  InflationSummaryCards
} from "@/components/indicators/inflation-charts";
import { DailyAnalysis } from "@/components/blog/daily-analysis";

import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getExchangeRates, getCountryRisk, getLatestNews, getReserves, getInflationSeries, getCurrencyHistory, getMarketIndices } from "@/lib/api";
import { calculatePulseScore } from "@/lib/pulse-engine";
import { generateTodaysAnalysis } from "@/lib/daily-analysis";

export default async function Home() {
  // Fetch real data on the server side
  const [rates, risk, news, reserves, inflationData, pulse, markets, historyOficial, historyBlue, historyMep, dailyPost] = await Promise.all([
    getExchangeRates(),
    getCountryRisk(),
    getLatestNews(),
    getReserves(),
    getInflationSeries(),
    calculatePulseScore(),
    getMarketIndices(),
    getCurrencyHistory('oficial'),
    getCurrencyHistory('blue'),
    getCurrencyHistory('bolsa'),
    generateTodaysAnalysis(),
  ]);

  // Create a merged payload of indicators
  const liveData = {
    rates: rates ? {
      ...rates,
      oficial: rates.oficial ? { ...rates.oficial, history: historyOficial } : null,
      blue: rates.blue ? { ...rates.blue, history: historyBlue } : null,
      bolsa: rates.bolsa ? { ...rates.bolsa, history: historyMep } : null,
    } : null,
    risk,
    reserves,
    inflation: inflationData?.[inflationData.length - 1],
    markets
  };

  // Inflation processing
  const sortedInflation = inflationData ? [...inflationData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];
  const latestInflation = sortedInflation[sortedInflation.length - 1] || { value: 0 };

  // Calculate YTD and YoY (Simple approximation for the home page)
  const yoyVal = 208.7;
  const ytdVal = 44.2;

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-16">
        <section id="hero" className="w-full">
          <PulseScore
            score={pulse.score ?? 50}
            previousScore={pulse.previousScore ?? 49.5}
            lastUpdated={pulse.lastUpdated ?? "Recently"}
            explanation={pulse.explanation ?? "Calculating health index..."}
          />
        </section>

        {/* Economic Pulse (Indicators Grid) */}
        <section id="indicators" className="w-full">
          <IndicatorsGrid liveData={liveData} />
        </section>

        {/* Ad Banner 1 — After indicators, high visibility */}
        <AdBanner slot="1234567890" format="horizontal" />

        {/* Sentiment & Thermometers Section */}
        <section id="sentiment" className="w-full">
          <SentimentThermometer />
        </section>

        {/* Integrated Inflation Terminal Section */}
        <section id="inflation" className="w-full">
          <section className="w-full space-y-8 py-12 border-y border-border/30 bg-muted/5 px-8 rounded-3xl">
            <InflationSummaryCards
              current={latestInflation.value}
              ytd={ytdVal}
              yoy={yoyVal}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <InflationHistoryChart data={sortedInflation.slice(-36)} />
              </div>
              <div className="lg:col-span-1">
                <PresidentialComparisonChart />
              </div>
            </div>
          </section>
        </section>

        {/* Strategic Insight Engine */}
        <section id="strategic" className="w-full">
          <InsightEngine />
        </section>

        {/* Growth Roadmap - Full Width */}
        <section id="timeline" className="w-full">
          <GrowthTimeline />
        </section>

        {/* Daily Analysis Blog */}
        {dailyPost && <DailyAnalysis post={dailyPost} />}

        {/* Multi-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
          {/* Main Financial Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Capital Markets Section */}
            <section id="markets" className="w-full">
              <CapitalMarkets data={markets as any} />
            </section>

            {/* News Hub */}
            <section id="news" className="w-full">
              <NewsHub liveNews={news} />
            </section>
          </div>

          {/* Social & Tools Column */}
          <div className="space-y-8 shrink-0">
            {/* Currency Converter */}
            <section id="converter" className="w-full">
              <CurrencyConverter rates={rates as any} />
            </section>

            {/* Weekly Poll */}
            <section id="poll" className="w-full">
              <WeeklyPoll />
            </section>

            {/* Gov Feed */}
            <section id="social" className="w-full">
              <GovFeed />
            </section>

            {/* Ad Banner 2 — Sidebar rectangle */}
            <AdBanner slot="0987654321" format="auto" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
