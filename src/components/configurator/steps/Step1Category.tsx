"use client";

import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import { Check } from "lucide-react";

export default function Step1Category() {
    const { state, dispatch } = useConfigurator();
    const categories = state.configData?.categories || [];

    const handleSelect = (id: string) => {
        dispatch({ type: "SELECT_CATEGORY", payload: id });
    };

    const handleNext = () => {
        if (state.categoryId) {
            dispatch({ type: "NEXT_STEP" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                    Was möchtest du mieten?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Wähle die passende Gerätekategorie für dein Vorhaben.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                    const isSelected = state.categoryId === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            className={`
                                relative group aspect-[3/4] rounded-2xl overflow-hidden text-left transition-all duration-300
                                ${isSelected
                                    ? "ring-4 ring-brand-teal ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-900 shadow-xl"
                                    : "hover:shadow-2xl hover:scale-[1.02]"
                                }
                            `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-zinc-800">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-6xl opacity-20">
                                        {cat.label.substring(0, 2)}
                                    </div>
                                )}
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="absolute top-6 left-6">
                                    <span className="bg-brand-teal text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        Ab 120 €
                                    </span>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    {cat.label}
                                </h3>
                                <p className="text-zinc-300 text-sm font-medium opacity-80 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    Flexible Mietoptionen verfügbar
                                </p>

                                {isSelected && (
                                    <div className="absolute top-6 right-6 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in fade-in zoom-in duration-200">
                                        <Check className="w-5 h-5" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <StepNavigation
                onNext={handleNext}
                canNext={!!state.categoryId}
            // No back button on first step
            />
        </div>
    );
}
