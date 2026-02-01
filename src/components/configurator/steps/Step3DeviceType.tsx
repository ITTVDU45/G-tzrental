"use client";

import { useEffect } from "react";
import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import { Check, Info } from "lucide-react";
import Image from "next/image";

export default function Step3DeviceType() {
    const { state, dispatch } = useConfigurator();
    const recommendations = state.recommendations;
    const config = state.configData;

    if (!recommendations || !config) return null;

    // Filter available device types based on recommendation or category
    // Using filtered device types from API recommendation
    const recommendedDeviceTypeIds = recommendations.suitableDeviceTypes.map(d => d.id);
    const availableDeviceTypes = config.deviceTypes.filter(dt =>
        dt.categoryId === state.categoryId && recommendedDeviceTypeIds.includes(dt.id)
    );

    // If recommendation returns none, maybe show all for category? Logic depends on strictness.
    // Let's assume we show what's available.
    const displayDeviceTypes = availableDeviceTypes.length > 0
        ? availableDeviceTypes
        : config.deviceTypes.filter(dt => dt.categoryId === state.categoryId).length > 0
            ? config.deviceTypes.filter(dt => dt.categoryId === state.categoryId)
            : config.deviceTypes;

    // Auto-select first type if none selected
    useEffect(() => {
        if (!state.deviceTypeId && displayDeviceTypes.length > 0) {
            dispatch({ type: "SELECT_DEVICE_TYPE", payload: displayDeviceTypes[0].id });
        }
    }, [state.deviceTypeId, displayDeviceTypes, dispatch]);

    const handleTypeSelect = (id: string) => {
        dispatch({ type: "SELECT_DEVICE_TYPE", payload: id });
    };

    const handleProductSelect = (id: string) => {
        dispatch({ type: "TOGGLE_PRODUCT_SELECTION", payload: id });
    };

    // Filter products by selected device type
    const productsForType = state.deviceTypeId
        ? recommendations.products.filter(p => p.deviceTypeId === state.deviceTypeId)
        : [];

    // Auto-select first product if none selected and products exist
    useEffect(() => {
        if (state.deviceTypeId && productsForType.length > 0 && state.selectedProductIds.length === 0) {
            dispatch({ type: "TOGGLE_PRODUCT_SELECTION", payload: productsForType[0].id });
        }
    }, [state.deviceTypeId, productsForType, state.selectedProductIds.length, dispatch]);

    return (
        <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                    Gefundene Lösungen
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Wir haben {recommendations.products.length} passende Geräte für deine Anforderungen gefunden.
                </p>
            </div>

            {/* 1. Device Types Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayDeviceTypes.map((dt) => {
                    const isSelected = state.deviceTypeId === dt.id;
                    return (
                        <button
                            key={dt.id}
                            onClick={() => handleTypeSelect(dt.id)}
                            className={`
                                relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                                ${isSelected
                                    ? "border-brand-teal bg-brand-teal/5 shadow-lg"
                                    : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-brand-teal/30"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-lg font-bold ${isSelected ? "text-brand-teal" : "text-zinc-800 dark:text-white"}`}>
                                    {dt.label}
                                </span>
                                {isSelected && (
                                    <div className="bg-brand-teal text-white rounded-full p-1">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                {dt.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* 2. Products List (Optional Selection) */}
            {state.deviceTypeId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                        Konkrete Modell-Empfehlungen
                        <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">Optional</span>
                    </h3>

                    {productsForType.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {productsForType.map((product) => {
                                const isSelected = state.selectedProductIds.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductSelect(product.id)}
                                        className={`
                                            group cursor-pointer flex gap-4 p-4 rounded-3xl border transition-all duration-300
                                            ${isSelected
                                                ? "border-brand-teal bg-brand-teal/5 shadow-md"
                                                : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:border-zinc-200"
                                            }
                                        `}
                                    >
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-zinc-300">No Img</div>
                                            )}
                                        </div>

                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    {product.badges?.map(b => (
                                                        <span key={b} className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full mb-2 mr-2">
                                                            {b}
                                                        </span>
                                                    ))}
                                                    <h4 className="font-bold text-zinc-900 dark:text-white">{product.title}</h4>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-brand-teal border-brand-teal text-white" : "border-zinc-300"}`}>
                                                        {isSelected && <Check className="w-3 h-3" />}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-lg font-bold text-zinc-900 dark:text-white leading-none">{product.price}€</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium">/ Tag</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-400">Höhe</span>
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.specs.maxHeight}m</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-400">Reichw.</span>
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.specs.maxReach}m</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-400">Last</span>
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.specs.maxLoad}kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl text-center text-zinc-500 text-sm">
                            Keine spezifischen Produkte für diese Kategorie in diesem Standort gelistet.
                            Du kannst trotzdem fortfahren – wir suchen das passende Gerät für dich raus.
                        </div>
                    )}
                </div>
            )}

            <StepNavigation
                onNext={() => dispatch({ type: "NEXT_STEP" })}
                onBack={() => dispatch({ type: "PREV_STEP" })}
                canNext={!!state.deviceTypeId}
            />
        </div>
    );
}
