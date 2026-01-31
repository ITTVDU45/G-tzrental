"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, Truck, Lock, CreditCard, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20">
            {/* Header */}
            <div className="container mx-auto px-6 mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight"
                >
                    Kontakt aufnehmen
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-500 max-w-3xl leading-relaxed"
                >
                    Landshut, Regensburg, München, Hamburg oder Wien – wir sind per Chat oder Telefon direkt erreichbar.
                </motion.p>
            </div>

            <div className="container mx-auto px-6 space-y-8">
                {/* Chat CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative"
                >
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden bg-zinc-200">
                                        <Image
                                            src={`https://images.unsplash.com/photo-${i === 1 ? '1568602471122-7832951cc4c5' : i === 2 ? '1580489944761-15a19d654956' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=100`}
                                            alt="Team member"
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-2">24/7 Erreichbar</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                            Starte deine Anfrage direkt im Chat
                        </h2>
                        <p className="text-zinc-500 mb-8 max-w-lg leading-relaxed">
                            Du hast eine konkrete Frage zu Geräten, Verfügbarkeit oder Einsatzbedingungen? Unser Team und unser Chatbot antworten schnell und helfen dir bei der richtigen Lösung – direkt im Chat, ohne Wartezeit.
                        </p>

                        <button className="bg-[#004e8d] hover:bg-[#003d70] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <MessageCircle className="w-5 h-5" />
                            Jetzt Chat starten
                        </button>
                    </div>

                    <div className="flex-1 w-full max-w-md relative">
                        {/* Mockup of chat interface */}
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700 p-6 relative transform md:rotate-2 md:translate-x-8 transition-transform duration-500 hover:rotate-0">
                            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-700 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold">
                                        B
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-900 dark:text-white">Bibot</div>
                                        <div className="text-xs text-zinc-500">Das Team kann ebenfalls helfen</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-600" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-600" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-4">
                                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2 animate-pulse" />
                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
                                </div>
                                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 animate-pulse" />
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-[#f0f4f8] text-zinc-900 dark:text-zinc-200 dark:bg-[#004e8d]/20 px-4 py-3 rounded-2xl rounded-tr-none text-sm font-medium">
                                        Was kann ich für dich tun?
                                    </div>
                                </div>
                                <div className="flex justify-end text-[10px] text-zinc-400 gap-1">
                                    <span>Bibot • AI Agent • Gerade eben</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid: Form + Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800"
                    >
                        <div className="mb-8">
                            <span className="text-zinc-500 text-lg block mb-2">Oder nutze unser</span>
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Kontaktformular für Angebots- und Projektanfragen</h2>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Name</label>
                                    <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none" placeholder="Max Mustermann" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">E-Mail</label>
                                    <input type="email" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none" placeholder="max@firma.de" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Firma</label>
                                    <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none" placeholder="Muster GmbH" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Telefonnummer</label>
                                    <input type="tel" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none" placeholder="+49 ..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Thema</label>
                                <div className="relative">
                                    <select className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 appearance-none focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none">
                                        <option>Allgemeine Anfrage</option>
                                        <option>Mietanfrage</option>
                                        <option>Kaufanfrage</option>
                                        <option>Service & Wartung</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Nachricht</label>
                                <textarea rows={5} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none resize-none" placeholder="Wie können wir helfen?" />
                            </div>

                            <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-4 rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                Nachricht senden
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12 py-8 lg:pl-4"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Unsere Adressen</h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">Götz Rental GmbH</h4>
                                    <p className="text-zinc-500 leading-relaxed text-sm">
                                        Hansestraße 45<br />
                                        20095 Hamburg
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">Standort München</h4>
                                    <p className="text-zinc-500 leading-relaxed text-sm">
                                        Leopoldstraße 23<br />
                                        80802 München
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">Standort Regensburg</h4>
                                    <p className="text-zinc-500 leading-relaxed text-sm">
                                        Landauer Str. 1<br />
                                        93055 Regensburg
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Per E-Mail</h3>
                            <a href="mailto:info@goetzrental.de" className="text-zinc-900 dark:text-white font-medium hover:text-brand-teal transition-colors">
                                info@goetzrental.de
                            </a>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Telefonisch</h3>
                            <div className="space-y-2">
                                <a href="tel:+49600123456" className="block text-zinc-900 dark:text-white font-medium hover:text-brand-teal transition-colors">
                                    Hamburg: +49 40 123 456
                                </a>
                                <a href="tel:+49891234567" className="block text-zinc-900 dark:text-white font-medium hover:text-brand-teal transition-colors">
                                    München: +49 89 123 456
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex gap-4">
                        <Phone className="w-6 h-6 flex-shrink-0 text-zinc-900 dark:text-white mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">24/7 Notfall Hotline</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">Als Mieter unserer Geräte erreichst du uns rund um die Uhr unter: +49 40 123456.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Truck className="w-6 h-6 flex-shrink-0 text-zinc-900 dark:text-white mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Inklusive Anlieferung</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">Wir liefern gemietete Arbeitsbühnen & Stapler direkt zu deinem Projekt – oder du holst direkt selbst ab.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Lock className="w-6 h-6 flex-shrink-0 text-zinc-900 dark:text-white mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Zugangskontrolle</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">Vertraue auf unsere GÖTZ KEY CARD: nie wieder Fremdnutzung von Maschinen. Versprochen.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <CreditCard className="w-6 h-6 flex-shrink-0 text-zinc-900 dark:text-white mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">SYSTEM-CARD Schulungen</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">Praxisnah, anerkannt, direkt bei uns – zertifizierte SYSTEM-CARD Schulungen.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="container mx-auto px-6 mt-12">
                <div className="w-full h-[500px] bg-zinc-100 relative grayscale mix-blend-multiply dark:mix-blend-normal dark:opacity-80 rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d155455.67954153725!2d11.458927807185072!3d48.154910609653775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75f9a38c5fd9%3A0x10cb84a7db1987d!2sM%C3%BCnchen!5e0!3m2!1sde!2sde!4v1706697486542!5m2!1sde!2sde"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    {/* Floating Location Cards Overlay (Style element "eine Karte" mentioned) */}
                    <div className="absolute top-8 left-8 md:top-12 md:left-12 space-y-4 pointer-events-none">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 w-64 pointer-events-auto hover:scale-105 transition-transform">
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                                <MapPin className="w-5 h-5 text-zinc-900 dark:text-white" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase text-zinc-400">Hauptquartier</div>
                                <div className="font-bold text-sm">Hamburg City</div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 w-64 pointer-events-auto hover:scale-105 transition-transform">
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                                <MapPin className="w-5 h-5 text-zinc-900 dark:text-white" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase text-zinc-400">Standort</div>
                                <div className="font-bold text-sm">München Nord</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating FAB */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full shadow-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:scale-110 transition-transform cursor-pointer group">
                    <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    );
}
