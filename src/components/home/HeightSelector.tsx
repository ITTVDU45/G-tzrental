"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";

const heightRanges = [
    { id: "60plus", label: "60+m", range: "60+m", mobileLabel: "60m+", title: "Giganten für extreme Höhen", desc: "Spezialgeräte für Windkraft und Industrie.", price: 950 },
    { id: "40-60", label: "40-60m", range: "40-60m", mobileLabel: "40-60m", title: "Maximaler Zugang", desc: "LKW-Bühnen und Super-Booms für Großprojekte.", price: 650 },
    { id: "30-40", label: "30-40m", range: "30-40m", mobileLabel: "30-40m", title: "Hocheffizient im Einsatz", desc: "Perfekt für Fassadenarbeiten an Hochhäusern.", price: 450 },
    { id: "28-30", label: "28-30m", range: "28-30m", mobileLabel: "28-30m", title: "Arbeitsbühnen bis 30m", desc: "Geeignet für größere Baustellen und anspruchsvolle Einsätze.", price: 250 },
    { id: "22-26", label: "22-26m", range: "22-26m", mobileLabel: "22-26m", title: "Vielseitige Mittelklasse", desc: "Ideal für Hallenbau und Wartungsarbeiten.", price: 200 },
    { id: "18-20", label: "18-20m", range: "18-20m", mobileLabel: "18-20m", title: "Standard für Gewerbe", desc: "Oft genutzt für Installationen und Reparaturen.", price: 152 },
    { id: "16", label: "16m", range: "16m", mobileLabel: "16m", title: "Kompakt & Wendig", desc: "Elektro-Scheren und Gelenksteiger für Innen.", price: 120 },
    { id: "14", label: "14m", range: "14m", mobileLabel: "14m", title: "Flexibel im Einsatz", desc: "Passt durch viele Standardtüren.", price: 110 },
    { id: "12", label: "12m", range: "12m", mobileLabel: "12m", title: "Der Allrounder", desc: "Unsere meistgemietete Klasse für Handwerker.", price: 95 },
    { id: "10", label: "10m", range: "10m", mobileLabel: "10m", title: "Einstiegsklasse", desc: "Sicherer Stand statt wackeliger Leiter.", price: 85 },
    { id: "6-8", label: "6-8m", range: "6-8m", mobileLabel: "6-8m", title: "Low-Level Access", desc: "Kompaktlifte für engste Räume.", price: 75 },
];

export function HeightSelector() {
    const [selectedId, setSelectedId] = useState("18-20");

    const selectedRange = heightRanges.find((r) => r.id === selectedId) || heightRanges[5];

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4">
                        Wie hoch musst du arbeiten?
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Wähle deine Arbeitshöhe und wir zeigen dir die passenden Geräte.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Navigation: Vertical Slider */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col items-end py-10 relative">
                        {/* Line */}
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200" />

                        {/* Items */}
                        <div className="relative z-10 flex flex-col gap-6 w-full">
                            {heightRanges.map((range) => {
                                const isActive = range.id === selectedId;
                                return (
                                    <button
                                        key={range.id}
                                        onClick={() => setSelectedId(range.id)}
                                        className={`group relative flex items-center justify-end gap-4 text-sm font-medium transition-all duration-300 ${isActive ? "text-brand-dark scale-110" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        <span className={isActive ? "font-bold" : ""}>{range.label}</span>
                                        {/* Dot Indicator */}
                                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? "bg-brand-teal w-3 h-3 translate-x-[4.5px]" : "bg-transparent group-hover:bg-gray-300"}`} />
                                    </button>
                                )
                            })}
                        </div>

                        {/* Animated Bubble Indicator (Optional, simpler to stick to CSS classes above for cleaner DOM, but could add layoutId for smooth sliding) */}
                    </div>

                    {/* Mobile Dropdown (visible on small screens only) */}
                    <div className="lg:hidden col-span-1">
                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 bg-white text-lg font-bold shadow-sm"
                        >
                            {heightRanges.map(r => (
                                <option key={r.id} value={r.id}>{r.mobileLabel} Arbeitshöhe</option>
                            ))}
                        </select>
                    </div>


                    {/* Center Content: Dynamic Display */}
                    <div className="lg:col-span-6 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-[8rem] leading-none font-bold text-brand-dark tracking-tighter">
                                        {selectedRange.range.replace("m", "")}
                                    </span>
                                    <span className="text-4xl text-gray-500 font-medium">m</span>
                                </div>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-8 pl-2">Arbeitshöhe</p>

                                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deine Auswahl</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedRange.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {selectedRange.desc}
                                    </p>

                                    <div className="flex items-center gap-2 mb-8">
                                        <span className="text-sm text-gray-500">ab</span>
                                        <span className="text-3xl font-bold text-brand-dark">{selectedRange.price} €</span>
                                        <span className="text-sm text-gray-400">/Tag</span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <Link href="/mieten" className="px-6 py-3 bg-white border-2 border-brand-dark text-brand-dark font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-colors flex items-center gap-2">
                                            Geräte anzeigen <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link href="/mieten" className="px-6 py-3 text-gray-500 font-medium hover:text-brand-teal transition-colors underline-offset-4 hover:underline">
                                            oder Stapler finden
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm pl-2 animate-pulse">
                            <ArrowUp className="w-4 h-4" />
                            <span>Ziehe nach oben für mehr Höhe</span>
                        </div>
                    </div>


                    {/* Right Content: Static Contact Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-brand-dark text-white rounded-3xl p-8 shadow-2xl sticky top-24">
                            <h3 className="text-xl font-bold mb-4">Unsicher bei Einsatz oder Höhe?</h3>
                            <p className="text-white/80 mb-8 leading-relaxed">
                                Wir prüfen Einsatz, Umfeld und Höhe gemeinsam. Gerne auch direkt bei dir vor Ort.
                            </p>

                            <div className="space-y-4 mb-8">
                                <a href="tel:+491234567890" className="flex items-center gap-3 hover:text-brand-teal transition-colors">
                                    <Phone className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">+49 721 123 456</span>
                                </a>
                                <a href="mailto:info@goetzrental.de" className="flex items-center gap-3 hover:text-brand-teal transition-colors">
                                    <Mail className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">info@goetzrental.de</span>
                                </a>
                            </div>

                            <Link href="/kontakt" className="inline-flex items-center gap-2 text-brand-teal font-bold hover:text-white transition-colors">
                                Kontaktiere uns <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
