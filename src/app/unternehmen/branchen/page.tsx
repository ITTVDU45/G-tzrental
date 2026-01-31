"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Truck, Trees, Zap, Warehouse, Music } from "lucide-react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FaqSection } from "@/components/home/FaqSection";

const industries = [
    {
        id: "bau",
        title: "Bau & Handwerk",
        description: "Robuste Lösungen für Baustellen jeder Größe. Von der Rohbauphase bis zur Fassadengestaltung.",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
        color: "bg-orange-500"
    },
    {
        id: "industrie",
        title: "Industrie & Produktion",
        description: "Emissionsfreie Geräte für den Innenbereich und kompakte Lösungen für enge Gänge.",
        icon: Warehouse,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        color: "bg-blue-500"
    },
    {
        id: "logistik",
        title: "Logistik & Transport",
        description: "Effiziente Hebetechnik für Lagerhallen und Umschlagplätze. Maximieren Sie Ihre Lagerkapazitäten.",
        icon: Truck,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        color: "bg-brand-teal"
    },
    {
        id: "facility",
        title: "Facility Management",
        description: "Wartung und Instandhaltung leicht gemacht. Sicherer Zugang für Reinigungs- und Reparaturarbeiten.",
        icon: Zap,
        image: "https://images.unsplash.com/photo-1581578731117-104f2a412c53?auto=format&fit=crop&q=80&w=800",
        color: "bg-yellow-500"
    },
    {
        id: "gala",
        title: "GaLaBau",
        description: "Geländegängige Bühnen für den Baumschnitt und Landschaftsbau. Schonend für den Untergrund.",
        icon: Trees,
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
        color: "bg-green-500"
    },
    {
        id: "events",
        title: "Events & Veranstaltungen",
        description: "Schwarze Bühnen für diskreten Aufbau und Technik für den Bühnenbau.",
        icon: Music,
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
        color: "bg-purple-500"
    }
];

export default function IndustriesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24">
            {/* Hero Section (Card Style) */}
            <section className="py-6 md:py-8 bg-white dark:bg-zinc-900/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="relative h-[600px] w-full overflow-hidden rounded-[3rem] bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 to-zinc-900/20 z-10" />
                        <Image
                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
                            alt="Industries Hero"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex items-center">
                            <div className="container mx-auto px-6 md:px-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-3xl"
                                >
                                    <span className="inline-block px-4 py-2 rounded-full bg-brand-lime/20 text-brand-lime border border-brand-lime/30 font-bold mb-6 backdrop-blur-sm">
                                        Branchenlösungen
                                    </span>
                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                                        Für jeden Einsatz <br />
                                        <span className="text-brand-teal">das passende Gerät</span>
                                    </h1>
                                    <p className="text-xl text-zinc-200 leading-relaxed max-w-2xl drop-shadow-md">
                                        Jede Branche hat ihre eigenen Anforderungen. Wir kennen die Herausforderungen und bieten maßgeschneiderte Lösungen für Ihren Erfolg.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Text */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-8">
                        Expertise über alle Branchen hinweg
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Ob in der Industriehalle, auf der Großbaustelle oder im unwegsamen Gelände – unsere Mietflotte ist so vielseitig wie Ihre Projekte. Entdecken Sie unsere spezialisierten Lösungen für Ihren Anwendungsbereich.
                    </p>
                </div>
            </section>

            {/* Industries Grid */}
            <section className="py-12 pb-32 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {industries.map((industry, index) => (
                            <motion.div
                                key={industry.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={industry.image}
                                        alt={industry.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className={`w-12 h-12 rounded-xl ${industry.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                                            <industry.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{industry.title}</h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 h-20">
                                        {industry.description}
                                    </p>
                                    <Link
                                        href={`/branchen/${industry.id}`}
                                        className="inline-flex items-center gap-2 text-brand-teal font-bold group-hover:gap-4 transition-all"
                                    >
                                        Mehr erfahren
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <BlogSection />
            <FaqSection />
            <FinalCtaSection />
        </div>
    );
}
