/**
 * Daily Analysis Generator
 * Auto-generates a blog-style daily analysis based on live economic data.
 */

import { getExchangeRates, getCountryRisk, getReserves, getInflationSeries, getMarketIndices } from "./api";

export interface DailyAnalysisSection {
    titleEs: string;
    titleEn: string;
    contentEs: string;
    contentEn: string;
}

export interface DailyAnalysisPost {
    id: string;
    date: string;
    dateFormatted: string;
    titleEs: string;
    titleEn: string;
    summaryEs: string;
    summaryEn: string;
    tags: string[];
    sentiment: "bullish" | "bearish" | "neutral" | "mixed";
    riskLevel: "low" | "medium" | "high";
    highlights: { labelEs: string; labelEn: string; value: string; trend: "up" | "down" | "neutral"; noteEs?: string; noteEn?: string }[];
    sections: DailyAnalysisSection[];
    keyPointsEs: string[];
    keyPointsEn: string[];
}

function formatDateEs(date: Date): string {
    return date.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).replace(/^./, (c) => c.toUpperCase());
}

function formatDateEn(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export async function generateTodaysAnalysis(): Promise<DailyAnalysisPost> {
    const [rates, risk, reserves, inflationData, markets] = await Promise.all([
        getExchangeRates(),
        getCountryRisk(),
        getReserves(),
        getInflationSeries(),
        getMarketIndices(),
    ]);

    const today = new Date();
    const id = today.toISOString().split("T")[0];

    // --- Extract key values ---
    const blueRate = rates?.blue?.sell ?? null;
    const oficialRate = rates?.oficial?.sell ?? null;
    const mepRate = rates?.bolsa?.sell ?? null;
    const cclRate = rates?.ccl?.sell ?? null;
    const countryRisk = risk?.value ?? null;
    const reservesBn = reserves?.value ? (reserves.value / 1000).toFixed(1) : null;
    const reservesRaw = reserves?.value ?? null;
    const latestInflation = inflationData ? inflationData[inflationData.length - 1]?.value : null;
    const merval = markets?.merval?.value ?? null;
    const mervalChange = markets?.merval?.change ?? null;
    const mervalTrend = markets?.merval?.trend ?? "neutral";

    // Spreads
    const blueSpread = blueRate && oficialRate ? (((blueRate - oficialRate) / oficialRate) * 100).toFixed(1) : null;
    const mepSpread = mepRate && oficialRate ? (((mepRate - oficialRate) / oficialRate) * 100).toFixed(1) : null;

    // --- Determine overall sentiment ---
    let bullishCount = 0;
    let bearishCount = 0;

    if (countryRisk !== null) {
        if (countryRisk < 600) bullishCount++;
        else if (countryRisk > 900) bearishCount++;
    }
    if (mervalTrend === "up") bullishCount++;
    if (mervalTrend === "down") bearishCount++;
    if (latestInflation !== null) {
        if (latestInflation < 3) bullishCount++;
        else if (latestInflation > 6) bearishCount++;
    }
    if (blueSpread !== null) {
        if (parseFloat(blueSpread) < 20) bullishCount++;
        else if (parseFloat(blueSpread) > 50) bearishCount++;
    }

    const sentiment: DailyAnalysisPost["sentiment"] =
        bullishCount > bearishCount + 1
            ? "bullish"
            : bearishCount > bullishCount + 1
                ? "bearish"
                : bullishCount === bearishCount
                    ? "neutral"
                    : "mixed";

    // Risk level
    const riskLevel: DailyAnalysisPost["riskLevel"] =
        bearishCount >= 3 ? "high"
            : bearishCount >= 2 ? "medium"
                : "low";

    // --- Build highlights ---
    const highlights: DailyAnalysisPost["highlights"] = [];

    if (blueRate !== null) {
        highlights.push({
            labelEs: "Dólar Blue",
            labelEn: "Blue Dollar",
            value: `$${blueRate.toLocaleString("es-AR")}`,
            trend: "neutral",
            noteEs: blueSpread ? `Brecha: ${blueSpread}%` : undefined,
            noteEn: blueSpread ? `Spread: ${blueSpread}%` : undefined,
        });
    }
    if (oficialRate !== null) {
        highlights.push({
            labelEs: "Tipo Oficial",
            labelEn: "Official Rate",
            value: `$${oficialRate.toLocaleString("es-AR")}`,
            trend: "neutral",
        });
    }
    if (countryRisk !== null) {
        highlights.push({
            labelEs: "Riesgo País",
            labelEn: "Country Risk",
            value: `${countryRisk.toLocaleString()} bps`,
            trend: countryRisk < 700 ? "up" : "down",
            noteEs: countryRisk < 700 ? "Nivel favorable" : countryRisk > 1000 ? "Nivel crítico" : "Nivel moderado",
            noteEn: countryRisk < 700 ? "Favorable level" : countryRisk > 1000 ? "Critical level" : "Moderate level",
        });
    }
    if (merval !== null) {
        highlights.push({
            labelEs: "MERVAL",
            labelEn: "MERVAL",
            value: `${mervalChange ?? ""}`,
            trend: mervalTrend as "up" | "down" | "neutral",
            noteEs: merval ? `$${merval.toLocaleString("es-AR")} pts` : undefined,
            noteEn: merval ? `$${merval.toLocaleString("en-US")} pts` : undefined,
        });
    }
    if (reservesBn !== null) {
        highlights.push({
            labelEs: "Reservas BCRA",
            labelEn: "BCRA Reserves",
            value: `USD ${reservesBn}B`,
            trend: reservesRaw && reservesRaw > 30000 ? "up" : "down",
            noteEs: reservesRaw && reservesRaw < 25000 ? "Nivel bajo" : "Controlado",
            noteEn: reservesRaw && reservesRaw < 25000 ? "Low level" : "Controlled",
        });
    }
    if (latestInflation !== null) {
        highlights.push({
            labelEs: "Inflación Mensual",
            labelEn: "Monthly CPI",
            value: `${latestInflation.toFixed(1)}%`,
            trend: latestInflation < 4 ? "up" : "down",
            noteEs: latestInflation < 4 ? "Desaceleración" : latestInflation > 8 ? "Alta presión" : "Moderada",
            noteEn: latestInflation < 4 ? "Decelerating" : latestInflation > 8 ? "High pressure" : "Moderate",
        });
    }

    // --- String helpers ---
    const blueStr = blueRate ? `$${blueRate.toLocaleString("es-AR")}` : "sin datos";
    const blueStrEn = blueRate ? `$${blueRate.toLocaleString("en-US")}` : "no data";
    const riskStr = countryRisk ? `${countryRisk.toLocaleString()} puntos básicos` : "sin datos";
    const riskStrEn = countryRisk ? `${countryRisk.toLocaleString()} bps` : "no data";
    const inflStr = latestInflation ? `${latestInflation.toFixed(1)}%` : "pendiente";
    const inflStrEn = latestInflation ? `${latestInflation.toFixed(1)}%` : "pending";

    const sentimentMapEs: Record<string, string> = { bullish: "optimista", bearish: "cauteloso", neutral: "neutro", mixed: "mixto" };
    const sentimentMapEn: Record<string, string> = { bullish: "optimistic", bearish: "cautious", neutral: "neutral", mixed: "mixed" };

    const titleEs = `Análisis del ${formatDateEs(today)}: Panorama Económico ${sentiment === "bullish" ? "Positivo" : sentiment === "bearish" ? "Negativo" : "Mixto"}`;
    const titleEn = `Analysis — ${formatDateEn(today)}: ${sentiment === "bullish" ? "Positive" : sentiment === "bearish" ? "Negative" : "Mixed"} Economic Outlook`;

    const summaryEs = [
        `El panorama económico argentino muestra un tono **${sentimentMapEs[sentiment]}** en la jornada de hoy.`,
        blueRate ? `El dólar blue opera en ${blueStr}${blueSpread ? `, con una brecha cambiaria del ${blueSpread}% respecto al oficial` : ""}.` : "",
        countryRisk ? `El riesgo país se ubica en ${riskStr}.` : "",
    ].filter(Boolean).join(" ");

    const summaryEn = [
        `Argentina's economic landscape shows a **${sentimentMapEn[sentiment]}** tone today.`,
        blueRate ? `The blue dollar trades at ${blueStrEn}${blueSpread ? `, with a ${blueSpread}% spread over the official rate` : ""}.` : "",
        countryRisk ? `Country risk stands at ${riskStrEn}.` : "",
    ].filter(Boolean).join(" ");

    // --- Sections (Extended Analysis) ---
    const sections: DailyAnalysisSection[] = [
        {
            titleEs: "🏛️ Contexto Macroeconómico",
            titleEn: "🏛️ Macroeconomic Context",
            contentEs: [
                `Argentina atraviesa un período de transición económica donde las variables financieras muestran señales ${sentimentMapEs[sentiment]}s.`,
                oficialRate ? `El tipo de cambio oficial se ubica en $${oficialRate.toLocaleString("es-AR")}, administrado bajo el esquema de crawling peg que el Banco Central sostiene para anclar expectativas inflacionarias.` : "",
                blueRate && blueSpread ? `La brecha cambiaria entre el dólar blue (${blueStr}) y el tipo oficial se sitúa en el ${blueSpread}%, un indicador clave de la presión sobre las reservas. ${parseFloat(blueSpread) < 20 ? "Una brecha por debajo del 20% refleja una relativa estabilidad del mercado cambiario." : parseFloat(blueSpread) > 50 ? "Una brecha superior al 50% señala tensiones significativas y puede anticipar presión sobre el tipo oficial." : "Un nivel de brecha moderado que refleja cierta incertidumbre pero sin señales de crisis cambiaria inmediata."}` : "",
                mepRate ? `El dólar MEP opera en $${mepRate.toLocaleString("es-AR")}${mepSpread ? `, con una brecha MEP-oficial del ${mepSpread}%` : ""}, siendo la referencia de los inversores locales para dolarizar carteras dentro del marco legal.` : "",
            ].filter(Boolean).join(" "),
            contentEn: [
                `Argentina is navigating an economic transition period where financial variables show ${sentimentMapEn[sentiment]} signals.`,
                oficialRate ? `The official exchange rate stands at $${oficialRate.toLocaleString("en-US")}, managed under the crawling peg scheme that the Central Bank maintains to anchor inflation expectations.` : "",
                blueRate && blueSpread ? `The exchange rate gap between the blue dollar (${blueStrEn}) and the official rate stands at ${blueSpread}%. ${parseFloat(blueSpread) < 20 ? "A spread below 20% reflects relative stability in the currency market." : parseFloat(blueSpread) > 50 ? "A spread above 50% signals significant tensions and may anticipate pressure on the official rate." : "A moderate spread level reflecting some uncertainty but no signs of imminent currency crisis."}` : "",
                mepRate ? `The MEP dollar trades at $${mepRate.toLocaleString("en-US")}${mepSpread ? `, with a MEP-official spread of ${mepSpread}%` : ""}, serving as the reference for local investors seeking legal dollarization.` : "",
            ].filter(Boolean).join(" "),
        },
        {
            titleEs: "📊 Diagnóstico por Sector",
            titleEn: "📊 Sector Breakdown",
            contentEs: [
                countryRisk ? `**Deuda soberana:** El riesgo país en ${riskStr} ${countryRisk < 600 ? "refleja un acceso potencial a los mercados internacionales de crédito, un hito crucial para la estrategia de financiamiento del Tesoro. Niveles por debajo de 600 bps históricamente habilitan colocaciones de deuda a tasas razonables." : countryRisk > 1000 ? "indica una prima de riesgo elevada que encarece cualquier refinanciamiento externo y limita el acceso al crédito internacional. El mercado descuenta una probabilidad no despreciable de stress de deuda." : "muestra una reducción importante respecto a los máximos históricos, aunque aún requiere mejoras sostenidas para habilitar emisiones soberanas líquidas."}` : "",
                merval ? `**Mercado de renta variable:** El MERVAL ${mervalTrend === "up" ? `avanza ${mervalChange ?? ""} en la jornada, reflejando apetito por el riesgo local y posible rotación desde activos de renta fija` : mervalTrend === "down" ? `retrocede ${mervalChange ?? ""} en la rueda, en línea con una mayor aversión al riesgo o toma de ganancias tras las subas recientes` : "opera de forma lateral, sin catalizadores claros en ninguna dirección"}. El índice en términos de dólares CCL es la métrica más relevante para inversores extranjeros.` : "",
                latestInflation ? `**Precios:** La inflación mensual más reciente de ${inflStr} ${latestInflation < 3 ? "marca un hito de desaceleración significativa. Si esta tendencia se confirma en los próximos meses, el Banco Central podría revisar el ritmo del crawling peg a la baja, liberando potencial para bajas de tasas." : latestInflation < 6 ? "se ubica en un rango de desaceleración gradual, aunque aún por encima del objetivo implícito de la gestión económica. Los precios regulados y los servicios son los principales componentes que dificultan una desinflación más rápida." : "sigue siendo elevada y representa el principal desafío de la gestión económica. La indexación de contratos y las expectativas desancladas retroalimentan el proceso inflacionario."}` : "",
                reservesBn ? `**Sector externo:** Las reservas brutas del BCRA en USD ${reservesBn} mil millones ${reservesRaw && reservesRaw > 35000 ? "ofrecen un margen de maniobra aceptable para defender el crawling peg y atender vencimientos de deuda en el corto plazo." : reservesRaw && reservesRaw < 25000 ? "se ubican en niveles críticos que limitan la capacidad del BCRA para intervenir en el mercado cambiario. La acumulación de reservas es el principal desafío de la política económica." : "muestran un nivel que requiere monitoreo constante. El saldo de turismo, las liquidaciones del agro y el financiamiento externo son los factores determinantes en los próximos meses."}` : "",
            ].filter(Boolean).join("\n\n"),
            contentEn: [
                countryRisk ? `**Sovereign debt:** Country risk at ${riskStrEn} ${countryRisk < 600 ? "reflects potential access to international credit markets, a crucial milestone for the Treasury's financing strategy. Levels below 600 bps historically enable debt placements at reasonable rates." : countryRisk > 1000 ? "indicates an elevated risk premium that raises the cost of any external refinancing and limits access to international credit. The market prices a non-negligible probability of debt stress." : "shows a significant reduction from historical highs, though further sustained improvements are needed to enable liquid sovereign issuances."}` : "",
                merval ? `**Equity market:** The MERVAL ${mervalTrend === "up" ? `gains ${mervalChange ?? ""} on the session, reflecting appetite for local risk and potential rotation from fixed income` : mervalTrend === "down" ? `falls ${mervalChange ?? ""} in the session, in line with increased risk aversion or profit-taking after recent gains` : "trades sideways, without clear catalysts in either direction"}. The index measured in CCL dollars is the most relevant metric for foreign investors.` : "",
                latestInflation ? `**Prices:** The latest monthly inflation of ${inflStrEn} ${latestInflation < 3 ? "marks a milestone of significant deceleration. If this trend is confirmed in coming months, the Central Bank could revise the crawling peg pace downward, opening room for rate cuts." : latestInflation < 6 ? "sits in a range of gradual deceleration, though still above the implicit target. Regulated prices and services are the main components delaying faster disinflation." : "remains elevated and is the main challenge of economic management. Contract indexation and unanchored expectations feed back into the inflationary process."}` : "",
                reservesBn ? `**External sector:** BCRA gross reserves at USD ${reservesBn}B ${reservesRaw && reservesRaw > 35000 ? "offer acceptable room to defend the crawling peg and service short-term debt maturities." : reservesRaw && reservesRaw < 25000 ? "sit at critical levels that limit the BCRA's ability to intervene in the forex market. Reserve accumulation is the main challenge of economic policy." : "show a level requiring constant monitoring. Tourism balance, agricultural liquidations, and external financing are the determining factors in coming months."}` : "",
            ].filter(Boolean).join("\n\n"),
        },
        {
            titleEs: "🔭 Perspectiva y Factores a Monitorear",
            titleEn: "🔭 Outlook & Key Factors to Watch",
            contentEs: [
                `En las próximas jornadas, los factores de mayor relevancia para la coyuntura económica argentina son:`,
                countryRisk && countryRisk < 800 ? `La evolución del riesgo país seguirá siendo determinante para evaluar si el mercado descuenta una salida del cepo cambiario. Un riesgo país sostenidamente por debajo de 700 bps amplía el margen de maniobra del Gobierno.` : `El riesgo país permanece como el termómetro principal del apetito inversor. Cualquier deterioro en el frente fiscal o tensión con el FMI podría presionar al alza este indicador.`,
                `La dinámica de acumulación de reservas del BCRA determinará la sostenibilidad del esquema cambiario actual. El saldo de la balanza comercial y las liquidaciones del sector agropecuario son variables clave a seguir.`,
                latestInflation ? `La inflación es el indicador más sensible política y socialmente. ${latestInflation < 4 ? "De consolidarse la tendencia desinflacionaria, el Gobierno podría avanzar más rápidamente en la normalización del mercado cambiario." : "Hasta que la inflación no converja a niveles de un dígito mensual, el esquema de ancla cambiaria seguirá siendo la principal herramienta anti-inflacionaria."}` : "",
                `El contexto internacional —particularmente la tasa de la Fed y los precios de las materias primas agrícolas— condicionará el flujo de divisas y el costo del crédito externo para Argentina.`,
            ].filter(Boolean).join(" "),
            contentEn: [
                `In the coming sessions, the most relevant factors for Argentina's economic outlook are:`,
                countryRisk && countryRisk < 800 ? `Country risk evolution will remain key to assessing whether the market prices in an exit from capital controls. Country risk sustainably below 700 bps gives the Government more room to maneuver.` : `Country risk remains the primary barometer of investor appetite. Any deterioration on the fiscal front or tensions with the IMF could push this indicator higher.`,
                `The BCRA's reserve accumulation dynamic will determine the sustainability of the current exchange rate scheme. Trade balance and agricultural sector liquidations are key variables to track.`,
                latestInflation ? `Inflation is the most politically and socially sensitive indicator. ${latestInflation < 4 ? "If the disinflationary trend consolidates, the Government could advance more quickly toward forex market normalization." : "Until inflation converges to single-digit monthly levels, the exchange rate anchor will remain the main anti-inflationary tool."}` : "",
                `The international context—particularly the Fed rate and agricultural commodity prices—will shape currency inflows and the cost of external credit for Argentina.`,
            ].filter(Boolean).join(" "),
        },
    ];

    // --- Key Points ---
    const keyPointsEs: string[] = [
        blueRate && blueSpread ? `Dólar blue en ${blueStr} con brecha del ${blueSpread}% frente al oficial` : blueRate ? `Dólar blue en ${blueStr}` : null,
        countryRisk ? `Riesgo país en ${countryRisk.toLocaleString()} bps — ${countryRisk < 700 ? "nivel favorable para acceso al crédito" : countryRisk > 1000 ? "nivel crítico, crédito internacional vedado" : "nivel moderado, mejora gradual"}` : null,
        merval && mervalChange ? `MERVAL ${mervalTrend === "up" ? "sube" : mervalTrend === "down" ? "baja" : "opera"} ${mervalChange} en la jornada` : null,
        latestInflation ? `Inflación mensual de ${inflStr} — ${latestInflation < 4 ? "tendencia desinflacionaria en curso" : latestInflation < 7 ? "desaceleración moderada, aún por encima del objetivo" : "presión inflacionaria persistente"}` : null,
        reservesBn ? `Reservas brutas del BCRA en USD ${reservesBn} mil millones` : null,
    ].filter(Boolean) as string[];

    const keyPointsEn: string[] = [
        blueRate && blueSpread ? `Blue dollar at ${blueStrEn} with a ${blueSpread}% spread over the official rate` : blueRate ? `Blue dollar at ${blueStrEn}` : null,
        countryRisk ? `Country risk at ${countryRisk.toLocaleString()} bps — ${countryRisk < 700 ? "favorable level for credit access" : countryRisk > 1000 ? "critical level, no international credit access" : "moderate level, gradual improvement"}` : null,
        merval && mervalChange ? `MERVAL ${mervalTrend === "up" ? "gains" : mervalTrend === "down" ? "falls" : "trades"} ${mervalChange} on the day` : null,
        latestInflation ? `Monthly inflation at ${inflStrEn} — ${latestInflation < 4 ? "disinflationary trend in progress" : latestInflation < 7 ? "moderate deceleration, still above target" : "persistent inflationary pressure"}` : null,
        reservesBn ? `BCRA gross reserves at USD ${reservesBn}B` : null,
    ].filter(Boolean) as string[];

    const tags = ["Economía", "Mercados", "Dólar", "BCRA", ...(mervalTrend === "up" ? ["MERVAL ↑"] : mervalTrend === "down" ? ["MERVAL ↓"] : []), ...(latestInflation && latestInflation < 4 ? ["Desinflación"] : [])];

    return {
        id,
        date: today.toISOString(),
        dateFormatted: formatDateEs(today),
        titleEs,
        titleEn,
        summaryEs,
        summaryEn,
        tags,
        sentiment,
        riskLevel,
        highlights,
        sections,
        keyPointsEs,
        keyPointsEn,
    };
}
