"use client";

import { useEffect } from "react";
import { ConfiguratorProvider, useConfigurator } from "../state/ConfiguratorContext";
import { fetchConfiguratorData } from "../api/configurator.client";
import Stepper from "./Stepper";
import Step1Category from "../steps/Step1Category";
import Step2Requirements from "../steps/Step2Requirements";
import Step3DeviceType from "../steps/Step3DeviceType";
import Step4Extras from "../steps/Step4Extras";
import Step5Contact from "../steps/Step5Contact";
import Step6Summary from "../steps/Step6Summary";
import { AnimatePresence, motion } from "framer-motion";
import PriceBadge from "./PriceBadge";

interface ConfiguratorShellProps {
    locationSlug: string;
}

function ConfiguratorContent({ locationSlug }: ConfiguratorShellProps) {
    const { state, dispatch } = useConfigurator();

    // Initial Data Fetch
    useEffect(() => {
        let mounted = true;
        const init = async () => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const data = await fetchConfiguratorData(locationSlug);
                if (mounted) {
                    dispatch({ type: "SET_DATA", payload: data });
                }
            } catch (err) {
                console.error(err);
                if (mounted) {
                    dispatch({ type: "SET_ERROR", payload: "Fehler beim Laden der Konfiguration." });
                }
            }
        };
        init();
        return () => { mounted = false; };
    }, [locationSlug, dispatch]);

    if (state.isLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-12">
                <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 font-medium animate-pulse">Konfigurator wird geladen...</p>
            </div>
        );
    }

    if (state.error || !state.configData) {
        return (
            <div className="w-full max-w-5xl mx-auto min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-12 text-center">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Da ist etwas schiefgelaufen</h3>
                <p className="text-zinc-500 mb-6">{state.error || "Keine Daten verfügbar."}</p>
                <button onClick={() => window.location.reload()} className="text-brand-teal font-bold hover:underline">
                    Neu laden
                </button>
            </div>
        );
    }

    if (state.isSuccess) {
        return (
            <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <div className="w-10 h-10 border-l-4 border-b-4 border-green-500 -rotate-45 relative top-[-2px] left-[2px] transform origin-center" style={{ transform: 'rotate(-45deg)' }}></div> {/* Simple Check Icon via CSS or use Lucide */}
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Vielen Dank!</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mb-8">
                    Deine Anfrage für den Standort <span className="text-brand-teal font-bold">{state.configData.location.name}</span> wurde erfolgreich übermittelt. Wir melden uns in Kürze bei dir.
                </p>
                <button onClick={() => window.location.reload()} className="bg-brand-teal text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-teal/90 transition-colors">
                    Zurück zur Übersicht
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
            <div className="p-6 md:p-12">
                <Stepper currentStep={state.step} steps={state.configData.steps} />

                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={state.step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {state.step === 1 && <Step1Category />}
                            {state.step === 2 && <Step2Requirements />}
                            {state.step === 3 && <Step3DeviceType />}
                            {state.step === 4 && <Step4Extras />}
                            {state.step === 5 && <Step5Contact />}
                            {state.step === 6 && <Step6Summary />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dynamic Price Badge integrated into the card footer area */}
                <PriceBadge />
            </div>
        </div>
    );
}

export default function ConfiguratorShell(props: ConfiguratorShellProps) {
    return (
        <ConfiguratorProvider>
            <ConfiguratorContent {...props} />
        </ConfiguratorProvider>
    );
}
