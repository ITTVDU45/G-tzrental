"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Info, ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const cartItems = [
    {
        id: 1,
        name: "Scherenbühne S138-12",
        category: "Scherenbühnen",
        image: "https://images.unsplash.com/photo-1541625602330-2277a1cd43a7?auto=format&fit=crop&q=80&w=400",
        price: "Ab 120€ / Tag",
        specs: ["Arbeitshöhe: 13.80m", "Tragkraft: 350kg"]
    },
    {
        id: 2,
        name: "Teleskopstapler T4517",
        category: "Teleskopstapler",
        image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&q=80&w=400",
        price: "Ab 180€ / Tag",
        specs: ["Hubhöhe: 17.00m", "Hubkraft: 4500kg"]
    }
];

export default function CartPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-zinc-500 hover:text-brand-teal transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Zurück zur Übersicht</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark dark:text-white">
                            Ihre <span className="text-brand-teal">Mietanfrage</span>
                        </h1>
                        <p className="text-zinc-500 mt-2">
                            Prüfen Sie Ihre Auswahl und senden Sie uns eine unverbindliche Anfrage.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cartItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-6 relative group overflow-hidden"
                            >
                                <div className="relative h-48 md:h-32 w-full md:w-48 rounded-2xl overflow-hidden shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">{item.category}</span>
                                            <h3 className="text-xl font-bold text-brand-dark dark:text-white mt-1">{item.name}</h3>
                                        </div>
                                        <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        {item.specs.map(spec => (
                                            <div key={spec} className="flex items-center gap-1.5 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 rounded-full">
                                                <Info className="w-3.5 h-3.5 text-brand-teal" />
                                                {spec}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-brand-teal font-bold">{item.price}</div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Summary Info */}
                        <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-3xl p-6 flex gap-4">
                            <div className="h-10 w-10 bg-brand-teal rounded-xl flex items-center justify-center shrink-0">
                                <Info className="text-white w-6 h-6" />
                            </div>
                            <p className="text-sm text-brand-dark/80 dark:text-zinc-300">
                                Diese Zusammenfassung ist eine <span className="font-bold">unverbindliche Anfrage</span>.
                                Erst nach Bestätigung durch unsere Mitarbeiter und Unterzeichnung des Mietvertrags kommt ein verbindliches Geschäft zustande.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Checkout */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-zinc-800 sticky top-32">
                            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">Projektdetails</h2>

                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500">Mietzeitraum</label>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <Calendar className="w-5 h-5 text-brand-teal" />
                                        <span className="text-sm font-medium">Datum wählen...</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500">Einsatzort</label>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <MapPin className="w-5 h-5 text-brand-teal" />
                                        <input
                                            type="text"
                                            placeholder="PLZ / Stadt"
                                            className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full placeholder:text-zinc-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-brand-teal to-brand-lime text-white rounded-2xl font-bold shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/40 transition-all flex items-center justify-center gap-2 group">
                                <span>Unverbindliche Mietanfrage</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-xs text-zinc-400 mt-4 px-4">
                                Durch Absenden erklären Sie sich mit unserer Datenschutzerklärung einverstanden.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
