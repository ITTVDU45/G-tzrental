"use client";

import { useConfigurator } from "../state/ConfiguratorContext";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export default function PriceBadge() {
    const { state } = useConfigurator();
    const {
        selectedProductIds,
        addedUpsellingIds,
        selectedExtras,
        configData,
        recommendations,
        contact
    } = state;

    if (!configData) return null;

    // 1. Get all selected products and their prices
    const allAvailableProducts = [
        ...(recommendations?.products || []),
        ...(configData.upsellingProducts || [])
    ];

    const selectedProducts = allAvailableProducts.filter(p =>
        selectedProductIds.includes(p.id) || addedUpsellingIds.includes(p.id)
    );

    const productDailyTotal = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

    // 2. Get all selected extras and their prices
    const selectedExtraItems = configData.extras.filter(e => selectedExtras.includes(e.id));

    // Debug log to see what's happening
    // console.log("Selected Extras for calculation:", selectedExtraItems);

    const extraDailyTotal = selectedExtraItems
        .filter(e => e.priceType === 'daily' || !e.priceType)
        .reduce((sum, e) => sum + (Number(e.price) || 0), 0);

    const extraOneTimeTotal = selectedExtraItems
        .filter(e => e.priceType === 'one-time')
        .reduce((sum, e) => sum + (Number(e.price) || 0), 0);

    // 3. Calculate duration
    let days = 1;
    if (contact.startDate && contact.endDate) {
        const start = new Date(contact.startDate);
        const end = new Date(contact.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    // 4. Calculate total
    const totalDaily = productDailyTotal + extraDailyTotal;
    const grandTotal = (totalDaily * days) + extraOneTimeTotal;

    const isVisible = selectedProducts.length > 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative group transition-all hover:shadow-md">
                        {/* Highlights */}
                        <div className="flex flex-col gap-1 items-center sm:items-start">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                Kalkulierter Preis
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-zinc-900 dark:text-white tabular-nums">
                                    {grandTotal.toLocaleString('de-DE')}€
                                </span>
                                <span className="text-xs font-bold text-zinc-400 uppercase">Gesamt</span>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Miete</span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                    {(productDailyTotal * days).toLocaleString('de-DE')}€
                                    <span className="text-[10px] text-zinc-400 ml-1 font-normal">({days} {days === 1 ? 'Tg' : 'Tge'})</span>
                                </span>
                            </div>
                            {extraDailyTotal > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Zusatz (tägl.)</span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{(extraDailyTotal * days).toLocaleString('de-DE')}€</span>
                                </div>
                            )}
                            {extraOneTimeTotal > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Zusatz (psch.)</span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{extraOneTimeTotal.toLocaleString('de-DE')}€</span>
                                </div>
                            )}
                        </div>

                        {/* Note */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 max-w-[240px]">
                            <Info className="w-4 h-4 text-brand-teal shrink-0" />
                            <span className="text-[10px] text-zinc-500 leading-tight font-medium">
                                Inkl. MwSt., zzgl. Transportkosten (siehe Angebot).
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
