"use client";

import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    "Über 22.000 Mietgeräte sofort verfügbar",
    "Bundesweite Lieferung innerhalb von 24h",
    "Professionelle Einweisung durch Experten",
    "Flexible Mietdauern & faire Konditionen",
];

interface FeatureSectionProps {
    onCtaClick?: () => void;
}

export function FeatureSection({ onCtaClick }: FeatureSectionProps) {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight mb-6">
                            Effiziente <span className="text-brand-teal">Mietlösungen</span> für Ihr nächstes Projekt
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Ob Großbaustelle oder privates Projekt – wir bieten Ihnen die passende Technik zur richtigen Zeit.
                            Profitieren Sie von unserer jahrzehntelangen Erfahrung und einem Maschinenpark, der keine Wünsche offen lässt.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-brand-lime flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <button
                            onClick={onCtaClick}
                            className="group flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-teal transition-all duration-300 shadow-xl shadow-brand-dark/10 hover:shadow-brand-teal/20 transform hover:-translate-y-1"
                        >
                            Jetzt Gerät finden
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>

                    {/* Image Composition */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/Baustelle2.png"
                                alt="Professioneller Einsatz modernster Mietmaschinen auf der Baustelle"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/20 to-transparent mix-blend-multiply" />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <Image
                                                src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                                                alt="User"
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm font-bold text-brand-dark">Top Bewertung</div>
                            </div>
                            <p className="text-gray-500 text-sm italic">
                                "Hervorragender Service und top gewartete Maschinen. Immer wieder gerne!"
                            </p>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
