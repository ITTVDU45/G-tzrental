"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function CtaSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* Outer Container (Cream/Beige Background Card) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-brand-dark/[0.03] rounded-[3rem] p-4 md:p-8 flex flex-col gap-6 md:gap-8 border border-brand-dark/5"
                >
                    {/* Top Section: Text & CTA Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-16 text-center space-y-8 border border-brand-teal/10 shadow-sm">
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark leading-snug max-w-4xl mx-auto">
                            Erleben Sie Effizienz durch modernste Mietknotenpunkt-Technik – <span className="text-brand-teal">bereit für jedes Großprojekt.</span>
                        </h2>

                        <div className="flex justify-center pt-2">
                            <Link
                                href="/kontakt"
                                className="px-10 py-4 bg-brand-lime text-brand-dark rounded-full font-bold text-lg hover:bg-brand-teal hover:text-white transition-all duration-500 shadow-md flex items-center gap-2 group"
                            >
                                Termin vereinbaren
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Section: Image Grid Card */}
                    <div className="relative h-[300px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden group">
                        {/* Main Background Image */}
                        <Image
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200"
                            alt="Construction site"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Floating Inner Image (Reference Style) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="relative w-40 h-40 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600"
                                    alt="Machine detail"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>

                        {/* Optional: Subtle Overlay for better contrast */}
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
