"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ArrowUpDown, ArrowRight } from "lucide-react";

export function ProductGridSection() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/admin/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Using the mock products. In a real app, we might filter/sort these.
    const displayProducts = products;

    if (loading) return null;

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4">
                            Beliebte Produkte
                        </h2>
                        <p className="text-zinc-500 max-w-lg">
                            Unsere am häufigsten gemieteten Maschinen für Ihr verlässliches Projekt.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Filter Button */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-teal transition-colors duration-300 text-brand-dark dark:text-white font-medium group shadow-sm"
                        >
                            <Filter className="w-4 h-4 group-hover:text-brand-teal transition-colors" />
                            <span>Filter</span>
                        </button>

                        {/* Sort Button */}
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-teal transition-colors duration-300 text-brand-dark dark:text-white font-medium group shadow-sm">
                            <span>Sortieren</span>
                            <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
                        </button>
                    </div>
                </div>

                {/* Mobile Controls (Visible only on small screens) */}
                <div className="flex items-center gap-4 mb-8 md:hidden">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium shadow-sm"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium shadow-sm">
                        <span>Sortieren</span>
                        <ArrowUpDown className="w-3 h-3" />
                    </button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col"
                        >
                            {/* Top: Image Area */}
                            <div className="relative h-[260px] p-6 flex items-center justify-center overflow-hidden">
                                {/* Decorative circle blur for depth */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />

                                {product.image && typeof product.image === 'string' && (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-xl"
                                    />
                                )}

                                {/* Availability Badge (Top Right) */}
                                <div className="absolute top-5 right-5 z-20">
                                    <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 dark:border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-200">Verfügbar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Content Area */}
                            <div className="p-6 flex flex-col flex-1 bg-white dark:bg-zinc-950 rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                                {/* Title & Category */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-teal">
                                            {product.subcategory}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark dark:text-white leading-tight group-hover:text-brand-teal transition-colors">
                                        {product.name}
                                    </h3>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-8">
                                    {product.details.height && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Arbeitshöhe</span>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.height}</span>
                                        </div>
                                    )}
                                    {product.details.reach && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Reichweite</span>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.reach}</span>
                                        </div>
                                    )}
                                    {product.details.load && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Tragkraft</span>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.load}</span>
                                        </div>
                                    )}
                                    {product.details.power && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Antrieb</span>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.power}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer: Price & Action */}
                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-900">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 uppercase font-bold">Tagesmiete</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-2xl font-bold text-brand-dark dark:text-white">{product.price}€</span>
                                            <span className="text-xs text-zinc-400 font-medium">/Tag</span>
                                        </div>
                                    </div>

                                    <Link href={`/mieten/geraet/${product.id}`}>
                                        <button className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-teal dark:hover:bg-brand-teal dark:hover:text-white transition-all duration-300 shadow-xl shadow-brand-dark/10 hover:shadow-brand-teal/20 transform hover:-translate-y-1">
                                            Mieten
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alle Produkte Button */}
                <div className="flex justify-center mt-12">
                    <Link
                        href="/mieten"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-xl font-bold hover:bg-brand-teal dark:hover:bg-brand-teal dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                    >
                        <span>Alle Produkte</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
