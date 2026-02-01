"use client";


import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import UpsellingModal from "../core/UpsellingModal";
import { submitLead } from "../api/configurator.client";
import { Edit2, MapPin, Calendar, User, Tag, Cog } from "lucide-react";
import { useState } from "react";

export default function Step6Summary() {
    const { state, dispatch } = useConfigurator();
    const [showUpsell, setShowUpsell] = useState(false);

    const onFinish = async () => {
        // This is the actual submit trigger
        dispatch({ type: "SUBMIT_START" });
        try {
            await submitLead(state);
            dispatch({ type: "SUBMIT_SUCCESS" });
        } catch (error) {
            dispatch({ type: "SUBMIT_FAILURE", payload: "Fehler beim Senden." });
        }
    };

    const handleInitialSubmit = () => {
        // Show modal if upselling products exist and haven't been shown yet?
        // Or always show. Logic: "wenn man auf anfrage senden klickt, öffnet sich erstmal ein kleines pupup"
        if (state.configData?.upsellingProducts?.length) {
            setShowUpsell(true);
        } else {
            onFinish();
        }
    };

    const jumpTo = (step: number) => {
        dispatch({ type: "GOTO_STEP", payload: step });
    };

    // Derived Data
    const category = state.configData?.categories.find(c => c.id === state.categoryId);
    const deviceType = state.configData?.deviceTypes.find(d => d.id === state.deviceTypeId);

    // recommendations are on state root, not inside configData
    const productsInState = state.recommendations?.products.filter(p => state.selectedProductIds.includes(p.id)) || [];

    // Fallback if no specific products selected
    const productDisplay = productsInState.length > 0
        ? productsInState.map(p => p.title).join(", ")
        : deviceType?.label;

    const extras = state.configData?.extras.filter(e => state.selectedExtras.includes(e.id)).map(e => e.label) || [];

    const Section = ({ title, step, icon: Icon, children }: any) => (
        <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl p-6 relative group border border-zinc-100 dark:border-zinc-800 hover:border-brand-teal/30 transition-all">
            <button
                onClick={() => jumpTo(step)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-brand-teal p-2 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
            >
                <Edit2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-brand-teal shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{title}</h3>
            </div>
            <div className="pl-[52px] space-y-1">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                    Alles korrekt?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Überprüfe deine Angaben bevor du die Anfrage absendest.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Geräteauswahl" step={3} icon={Cog}>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">{productDisplay}</p>
                    <p className="text-sm text-zinc-500">{category?.label} • {state.requirements.sliders['height']}m Höhe</p>
                </Section>

                <Section title="Zusatzleistungen" step={4} icon={Tag}>
                    {extras.length > 0 ? (
                        extras.map(e => <p key={e} className="text-zinc-700 dark:text-zinc-300">{e}</p>)
                    ) : (
                        <p className="text-zinc-400 italic">Keine ausgewählt</p>
                    )}
                </Section>

                <Section title="Einsatzdaten" step={5} icon={Calendar}>
                    <p className="text-zinc-700 dark:text-zinc-300">
                        {state.contact.startDate?.toLocaleDateString()} – {state.contact.endDate?.toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {state.contact.delivery ? "Lieferung nach: " : "Selbstabholung"}
                        {state.contact.location && <span className="font-medium text-zinc-700 dark:text-zinc-300">{state.contact.location}</span>}
                    </div>
                </Section>

                <Section title="Kontakt" step={5} icon={User}>
                    <p className="text-zinc-700 dark:text-zinc-300 font-bold">{state.contact.company}</p>
                    <p className="text-zinc-700 dark:text-zinc-300">{state.contact.name}</p>
                    <p className="text-sm text-zinc-500">{state.contact.email} • {state.contact.phone}</p>
                </Section>
            </div>

            {state.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold">
                    {state.error}
                </div>
            )}

            <StepNavigation
                onNext={handleInitialSubmit}
                onBack={() => dispatch({ type: "PREV_STEP" })}
                canNext={true}
                isLastStep={true}
                isSubmitting={state.isSubmitting}
            />

            <UpsellingModal
                isOpen={showUpsell}
                onClose={() => setShowUpsell(false)}
                onConfirm={() => {
                    setShowUpsell(false);
                    onFinish();
                }}
            />
        </div>
    );
}
