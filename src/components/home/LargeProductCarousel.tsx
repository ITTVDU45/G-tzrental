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
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
        isSpecial: true,
    },
    {
        id: "scissors",
        title: "Scherenbühnen",
        subtitle: "Vertikal",
        price: "ab 120 €",
        image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "telescope",
        title: "Teleskopbühnen",
        subtitle: "Reichweite",
        price: "ab 180 €",
        image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "articulated",
        title: "Gelenkbühnen",
        subtitle: "Flexibel",
        price: "ab 150 €",
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "truck",
        title: "LKW-Bühnen",
        subtitle: "Mobil",
        price: "ab 250 €",
        image: "https://images.unsplash.com/photo-1625907481189-d6600c50c544?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "forklift",
        title: "Stapler",
        subtitle: "Lasten",
        price: "ab 95 €",
        image: "https://images.unsplash.com/photo-1589717013858-29b14db8355b?auto=format&fit=crop&q=80&w=800",
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
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                                            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-sm font-semibold">
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
