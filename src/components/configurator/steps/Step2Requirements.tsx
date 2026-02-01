"use client";

import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import RangeSlider from "../fields/RangeSlider";
import { fetchRecommendations } from "../api/configurator.client";
import { ChevronDown, Check } from "lucide-react";

export default function Step2Requirements() {
    const { state, dispatch } = useConfigurator();
    const filters = state.configData?.filters?.items || [];

    const sliders = filters.filter(f => f.type === 'slider');
    const others = filters.filter(f => f.type !== 'slider');

    const handleSliderChange = (key: string, value: number) => {
        dispatch({
            type: "UPDATE_REQUIREMENTS",
            payload: { sliders: { [key]: value } }
        });
    };

    const handleSelectChange = (key: string, value: string) => {
        dispatch({
            type: "UPDATE_REQUIREMENTS",
            payload: { selects: { [key]: value } }
        });
    };

    const handleCheckboxChange = (key: string, optionValue: string, currentValues: string) => {
        const selected = currentValues ? currentValues.split(',') : [];
        let newSelected;
        if (selected.includes(optionValue)) {
            newSelected = selected.filter(v => v !== optionValue);
        } else {
            newSelected = [...selected, optionValue];
        }
        handleSelectChange(key, newSelected.join(','));
    };

    const handleNext = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const results = await fetchRecommendations({
                locationId: state.configData?.location.id,
                categoryId: state.categoryId,
                filters: state.requirements
            });
            dispatch({ type: "SET_RECOMMENDATIONS", payload: results });
            dispatch({ type: "NEXT_STEP" });
        } catch (err) {
            console.error(err);
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    if (filters.length === 0) return null;

    return (
        <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                    Welche Anforderungen hast du?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Definiere die wichtigsten Parameter für deinen Einsatz.
                </p>
            </div>

            {/* Sliders Grid */}
            {sliders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sliders.map((slider) => {
                        const currentVal = state.requirements.sliders[slider.key] ?? (slider.defaultValue as number) ?? 0;
                        return (
                            <RangeSlider
                                key={slider.id}
                                label={slider.label}
                                unit={slider.unit || ''}
                                min={slider.min || 0}
                                max={slider.max || 100}
                                step={slider.step || 1}
                                value={currentVal}
                                onChange={(val) => handleSliderChange(slider.key, val)}
                            />
                        );
                    })}
                </div>
            )}

            {/* Others Grid */}
            {others.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    {others.map((field) => {
                        const currentVal = state.requirements.selects[field.key] || "";

                        return (
                            <div key={field.id} className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider pl-1">
                                    {field.label}
                                </label>

                                {field.type === 'select' && (
                                    <div className="relative">
                                        <select
                                            value={currentVal}
                                            onChange={(e) => handleSelectChange(field.key, e.target.value)}
                                            className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 pr-10 text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all cursor-pointer"
                                        >
                                            <option value="" disabled>Bitte wählen...</option>
                                            {field.options?.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    </div>
                                )}

                                {field.type === 'radio' && (
                                    <div className="flex flex-wrap gap-2">
                                        {field.options?.map((opt) => {
                                            const isSelected = currentVal === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleSelectChange(field.key, opt.value)}
                                                    className={`
                                                        px-4 py-2 rounded-lg text-sm font-bold transition-all border
                                                        ${isSelected
                                                            ? "bg-brand-teal text-white border-brand-teal shadow-md"
                                                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-brand-teal/50"
                                                        }
                                                    `}
                                                >
                                                    {opt.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}

                                {field.type === 'checkbox' && (
                                    <div className="grid gap-2">
                                        {field.options?.map((opt) => {
                                            const isSelected = currentVal.split(',').includes(opt.value);
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleCheckboxChange(field.key, opt.value, currentVal)}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border
                                                        ${isSelected
                                                            ? "bg-brand-teal/5 border-brand-teal"
                                                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-brand-teal/30"
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded flex items-center justify-center transition-colors
                                                        ${isSelected ? "bg-brand-teal text-white" : "bg-zinc-200 dark:bg-zinc-700"}
                                                    `}>
                                                        {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isSelected ? "text-brand-teal" : "text-zinc-700 dark:text-zinc-300"}`}>
                                                        {opt.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <StepNavigation
                onNext={handleNext}
                onBack={() => dispatch({ type: "PREV_STEP" })}
                canNext={true}
            />
        </div>
    );
}
