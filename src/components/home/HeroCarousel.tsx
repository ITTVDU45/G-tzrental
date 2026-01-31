"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
    {
        id: 0,
        title: "Industrielle Lösungen für höchste Präzision",
        description: "Unsere Spezialgeräte für Lager und Industrie – kompakt, wendig und leistungsstark.",
        image: "/GrünerSpiderListinIndustrielager.png",
        cta: "Spezialgeräte entdecken",
        color: "bg-brand-green",
    },
    {
        id: 1,
        title: "Effiziente Logistik mit modernster Technik",
        description: "Leistungsstarke Stapler für Ihren Warenumschlag. Zuverlässig und einsatzbereit.",
        image: "/StablerinIndustriehalle.png",
        cta: "Stapler ansehen",
        color: "bg-brand-dark",
    },
    {
        id: 2,
        title: "Ihre Experten für Arbeitsbühnen & Scherenbühnen",
        description: "Qualität und Sicherheit für Ihre Projekte in luftiger Höhe. Entdecken Sie unsere moderne Flotte.",
        image: "/Teleskopbühne&Scherenbühne.png",
        cta: "Jetzt anfragen",
        color: "bg-brand-teal",
    },
];

interface HeroCarouselProps {
    onExploreClick?: () => void;
}

export function HeroCarousel({ onExploreClick }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);

    // Safety check: reset current index if it exceeds the length of slides (useful for HMR)
    useEffect(() => {
        if (current >= slides.length) {
            setCurrent(0);
        }
    }, [current]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Fallback to avoid runtime crash if state is temporarily invalid
    const activeSlide = slides[current] || slides[0];

    return (
        <section className="py-6 md:py-8 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative h-[600px] w-full overflow-hidden rounded-[3rem] bg-brand-dark shadow-2xl border border-zinc-100 dark:border-zinc-800">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 bg-black/40 z-10" />
                            <Image
                                src={activeSlide.image}
                                alt={activeSlide.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />

                            {/* Content */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <div className="container mx-auto px-6 md:px-12">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="max-w-3xl space-y-6"
                                    >
                                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                                            {activeSlide.title}
                                        </h1>
                                        <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed drop-shadow-sm">
                                            {activeSlide.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <button
                                                onClick={onExploreClick}
                                                className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-xl transition-transform hover:scale-105 ${activeSlide.color}`}
                                            >
                                                {activeSlide.cta}
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={onExploreClick}
                                                className="px-8 py-4 rounded-full font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                                            >
                                                Mehr erfahren
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="absolute bottom-8 right-8 z-30 flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-brand-teal" : "w-2 bg-white/50 hover:bg-white"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
