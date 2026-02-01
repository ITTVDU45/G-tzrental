"use client";

import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import { Plus, Check } from "lucide-react";

export default function Step4Extras() {
    const { state, dispatch } = useConfigurator();
    const extras = state.configData?.extras || [];

    const toggleExtra = (id: string) => {
        dispatch({ type: "TOGGLE_EXTRA", payload: id });
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                    Benötigst du Zubehör?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Wähle optionale Zusatzleistungen für deinen Einsatz.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extras.map((extra) => {
                    const isSelected = state.selectedExtras.includes(extra.id);
                    return (
                        <button
                            key={extra.id}
                            onClick={() => toggleExtra(extra.id)}
                            className={`
                                group flex flex-col items-start text-left p-6 rounded-3xl border-2 transition-all duration-300
                                ${isSelected
                                    ? "border-brand-teal bg-brand-teal/5"
                                    : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-teal/30"
                                }
                            `}
                        >
                            <div className="w-full flex justify-between items-start mb-4">
                                <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? "text-brand-teal" : "text-zinc-500"}`}>
                                    {extra.priceHint}
                                </span>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                    ${isSelected ? "bg-brand-teal text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200"}
                                `}>
                                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                                {extra.label}
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                {extra.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            <StepNavigation
                onNext={() => dispatch({ type: "NEXT_STEP" })}
                onBack={() => dispatch({ type: "PREV_STEP" })}
                canNext={true}
            />
        </div>
    );
}
