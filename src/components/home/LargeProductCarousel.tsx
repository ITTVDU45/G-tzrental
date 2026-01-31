"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const highlightProducts = [
    {
        id: "all",
        title: "Alle Geräte",
        count: "22.000+",
        subtitle: "Unser Mietpark",
        image: "/Alle geräte.png",
        isSpecial: true,
    },
    {
        id: "scissors",
        title: "Scherenbühnen",
        subtitle: "Vertikal",
        price: "ab 120 €",
        image: "/Scherenbühne.png",
    },
    {
        id: "telescope",
        title: "Teleskopbühnen",
        subtitle: "Reichweite",
        price: "ab 180 €",
        image: "/Teleskopbühne.png",
    },
    {
        id: "articulated",
        title: "Gelenkteleskope",
        subtitle: "Flexibel",
        price: "ab 150 €",
        image: "/Gelenkteleskop.png",
    },
    {
        id: "mast",
        title: "Mastbühnen",
        subtitle: "Kompakt",
        price: "ab 95 €",
        image: "/Mastbühne.png",
    },
    {
        id: "forklift",
        title: "Gabelstapler",
        subtitle: "Lasten",
        price: "ab 95 €",
        image: "/Gabelstabler.png",
    },
    {
        id: "roto",
        title: "Roto-Stapler",
        subtitle: "Multifunktional",
        price: "ab 350 €",
        image: "/Rotostabler.png",
    },
];

export function LargeProductCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark max-w-2xl">
                        Unsere Highlights
                    </h2>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll("left")}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto py-12 px-16 snap-x scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {highlightProducts.map((item, index) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                            className={`flex-shrink-0 snap-start h-[500px] ${item.isSpecial ? "w-[320px] md:w-[420px]" : "w-[280px] md:w-[350px]"
                                } ${index === 0 ? "ml-4" : ""}`}
                        >
                            <Link
                                href={item.isSpecial ? "/mieten" : `/mieten/geraet/${item.id === 'scissors' ? 'mb-80-e' : item.id === 'telescope' ? 'tb-160' : item.id === 'forklift' ? 'gs-25' : 'all'}`}
                                className={`block h-full group relative rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 ${item.isSpecial ? "ring-2 ring-brand-teal ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-900" : ""}`}
                            >
                                <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                                    {/* Background Image */}
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-6 bg-white transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    {/* Top Badges (Price or Special) */}
                                    <div className="flex justify-between items-start">
                                        {!item.isSpecial && item.price && (
                                            <div className="bg-brand-teal px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg shadow-brand-teal/20">
                                                {item.price}
                                            </div>
                                        )}
                                        {item.isSpecial && (
                                            <div className="bg-brand-teal px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg shadow-brand-teal/20">
                                                {item.count}
                                            </div>
                                        )}

                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {item.subtitle && (
                                            <span className="text-brand-lime font-medium text-sm tracking-uppercase mb-1 block">
                                                {item.subtitle}
                                            </span>
                                        )}
                                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="h-0.5 w-12 bg-brand-teal group-hover:w-full transition-all duration-500" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
