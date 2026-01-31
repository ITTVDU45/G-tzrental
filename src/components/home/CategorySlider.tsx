"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const categories = [
    { name: "Teleskopbühnen", image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=600", count: "12 Modelle" },
    { name: "Scherenbühnen", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600", count: "8 Modelle" },
    { name: "Gelenkteleskope", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600", count: "15 Modelle" },
    { name: "Mastbühnen", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600", count: "5 Modelle" },
    { name: "Gabelstapler", image: "https://images.unsplash.com/photo-1589717013858-29b14db8355b?auto=format&fit=crop&q=80&w=600", count: "20 Modelle" },
    { name: "Roto-Stapler", image: "https://images.unsplash.com/photo-1518385888806-38d2239f6044?auto=format&fit=crop&q=80&w=600", count: "7 Modelle" },
    { name: "Anhänger", image: "https://images.unsplash.com/photo-1625907481189-d6600c50c544?auto=format&fit=crop&q=80&w=600", count: "10 Modelle" },
];

export function CategorySlider() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                direction === "left"
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (categories.length === 0) return;
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                // Check if we've reached the end
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scroll("right");
                }
            }
        }, 5000); // Scroll every 5 seconds

        return () => clearInterval(interval);
    }, [categories]);

    if (loading) return null; // Or a skeleton

    return (
        <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4 md:px-6 relative group/section">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Unser Mietpark
                    </h2>
                    <Link href="/mieten" className="flex items-center gap-1 text-brand-teal font-medium hover:text-brand-green transition-colors">
                        Alle Kategorien <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Left Navigation Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-brand-dark transition-all duration-300 hover:bg-white border border-gray-100 hidden md:block"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Navigation Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-brand-dark transition-all duration-300 hover:bg-white border border-gray-100 hidden md:block"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for Firefox and IE
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="min-w-[200px] md:min-w-[240px] snap-center group"
                        >
                            <Link href={cat.link || `/mieten/${cat.name.toLowerCase()}`} className="block h-full cursor-pointer">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="pt-4 text-center">
                                    <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-teal transition-colors">{cat.name}</h3>
                                    <p className="text-sm text-foreground/60">{cat.count} Modelle</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
