import { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getExchangeRates, getCurrencyHistory } from "@/lib/api";
import { DollarBlueContent } from "./content";

export const metadata: Metadata = {
    title: "Dólar Blue Today in Argentina | ARGPULSE",
    description: "Live updates of the Dólar Blue (informal/parallel exchange rate) in Argentina. Compare with MEP, CCL, and Official rates.",
};

export default async function DollarBluePage() {
    const [rates, history] = await Promise.all([
        getExchangeRates(),
        getCurrencyHistory('blue')
    ]);

    const blueRate = rates?.blue || { buy: 0, sell: 0, updatedAt: new Date().toISOString() };

    return (
        <>
            <Navbar />
            <DollarBlueContent blueRate={blueRate} history={history || []} />
            <Footer />
        </>
    );
}
