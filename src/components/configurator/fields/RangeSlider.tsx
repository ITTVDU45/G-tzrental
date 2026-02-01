import { useState } from "react";

interface RangeSliderProps {
    label: string;
    unit: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (val: number) => void;
}

export default function RangeSlider({ label, unit, min, max, step = 1, value, onChange }: RangeSliderProps) {
    // Local state for smooth sliding before committing (optional but good for perforamnce if heavy)
    // For now direct control is fine for this scale

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
                <div className="flex items-baseline gap-1 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{value}</span>
                    <span className="text-xs font-bold text-zinc-500">{unit}</span>
                </div>
            </div>

            <div className="relative w-full h-6 flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    {/* Active Track */}
                    <div
                        className="h-full bg-brand-teal"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Range Input (Invisible overlay) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb Handle (visual only, positioned by percentage) */}
                <div
                    className="absolute h-6 w-6 bg-white border-4 border-brand-teal rounded-full shadow-lg pointer-events-none transition-transform active:scale-110"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                />
            </div>

            <div className="flex justify-between mt-4 text-xs font-medium text-zinc-400">
                <span>{min} {unit}</span>
                <span>{max} {unit}</span>
            </div>
        </div>
    );
}
