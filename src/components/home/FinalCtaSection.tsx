"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCtaSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2000"
                            alt="Construction site background"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Dark Overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand-dark/90 to-zinc-900/95 dark:from-black/95 dark:via-black/90 dark:to-zinc-950/95" />
                    </div>

                    {/* Subtle Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 py-16 px-6 md:px-12">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/20 border border-brand-teal/30 rounded-full mb-6 backdrop-blur-sm">
                                <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
                                <span className="text-brand-teal font-semibold text-sm uppercase tracking-wide">
                                    Jetzt starten
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Bereit für Ihr nächstes Projekt?
                            </h2>

                            {/* Subheadline */}
                            <p className="text-xl text-zinc-200 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Über 22.000 Geräte stehen für Sie bereit. Mieten Sie noch heute die perfekte Arbeitsbühne,
                                Stapler oder Baumaschine für Ihr Vorhaben.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                <Link
                                    href="/mieten"
                                    className="group relative px-8 py-4 bg-brand-teal text-white rounded-2xl font-bold text-lg hover:bg-brand-lime transition-all duration-300 shadow-xl shadow-brand-teal/20 hover:shadow-2xl hover:shadow-brand-lime/30 transform hover:-translate-y-1 flex items-center gap-3"
                                >
                                    <span>Jetzt Gerät mieten</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/kontakt"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand-dark transition-all duration-300 flex items-center gap-3 group"
                                >
                                    <span>Beratung anfragen</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Contact Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                                {/* Phone */}
                                <a
                                    href="tel:+4912345678900"
                                    className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:border-brand-teal/50 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 rounded-full bg-brand-teal/20 flex items-center justify-center group-hover:bg-brand-teal/30 transition-colors flex-shrink-0">
                                        <Phone className="w-6 h-6 text-brand-teal" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm text-zinc-300 mb-1">Rufen Sie uns an</div>
                                        <div className="text-white font-bold text-lg">+49 (0) 123 456 789-00</div>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:info@goetzrental.de"
                                    className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:border-brand-teal/50 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 rounded-full bg-brand-teal/20 flex items-center justify-center group-hover:bg-brand-teal/30 transition-colors flex-shrink-0">
                                        <Mail className="w-6 h-6 text-brand-teal" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm text-zinc-300 mb-1">Schreiben Sie uns</div>
                                        <div className="text-white font-bold text-lg">info@goetzrental.de</div>
                                    </div>
                                </a>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/20">
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2">22.000+</div>
                                    <div className="text-sm text-zinc-300">Verfügbare Geräte</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-brand-lime mb-2">24/7</div>
                                    <div className="text-sm text-zinc-300">Notdienst</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2">100%</div>
                                    <div className="text-sm text-zinc-300">Versichert</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-brand-lime mb-2">48h</div>
                                    <div className="text-sm text-zinc-300">Express-Lieferung</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
