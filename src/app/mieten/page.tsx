"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/mockProducts";
import { ChevronRight, Filter, ArrowUpDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Static metadata for the "All Products" page
const allCategoriesMeta = {
    title: "Unser Mietpark",
    description: "Entdecken Sie unser gesamtes Sortiment an Hebebühnen, Staplern und Baumaschinen – für jeden Einsatz das passende Gerät.",
    subcategories: [
        { name: "Arbeitsbühnen", image: "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen" },
        { name: "Stapler", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600", link: "/mieten/stapler" },
        { name: "Baumaschinen", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600", link: "/mieten/baumaschinen" },
        { name: "Scherenbühnen", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen" },
        { name: "Gelenkteleskope", image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen" },
        { name: "LKW-Bühnen", image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen" },
        { name: "Gabelstapler", image: "https://images.unsplash.com/photo-1589717013858-29b14db8355b?auto=format&fit=crop&q=80&w=600", link: "/mieten/stapler" },
    ]
};

export default function AllProductsPage() {
    // Determine products to show (All products)
    const categoryProducts = useMemo(() => {
        return products;
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
            {/* Breadcrumbs */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Link href="/" className="hover:text-brand-teal">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-900 dark:text-white font-medium">Mietpark</span>
                </div>
            </div>

            {/* Header Section */}
            <div className="container mx-auto px-6 mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight"
                >
                    {allCategoriesMeta.title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-500 max-w-2xl mb-12"
                >
                    {allCategoriesMeta.description}
                </motion.p>

                {/* Subcategories / Categories Horizontal Scroll */}
                <div className="relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('subcategory-scroll-container');
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-teal hover:text-white"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('subcategory-scroll-container');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-teal hover:text-white"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div
                        id="subcategory-scroll-container"
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {allCategoriesMeta.subcategories.map((sub, idx) => (
                            <Link key={sub.name} href={sub.link} className="flex-shrink-0 snap-start h-[320px] w-[260px]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 + 0.2 }}
                                    className="h-full w-full"
                                >
                                    <div className="group/card relative h-full w-full rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                        {/* Background Image */}
                                        <Image
                                            src={sub.image}
                                            alt={sub.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                                            <div className="transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                                                    {sub.name}
                                                </h3>
                                                <div className="h-0.5 w-12 bg-brand-teal group-hover/card:w-full transition-all duration-500" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shop Controls */}
            <div className="sticky top-20 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-y border-zinc-100 dark:border-zinc-800 mb-8">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-brand-teal hover:text-brand-teal transition-all text-sm font-semibold bg-white dark:bg-zinc-900">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>

                        <div className="hidden md:block text-sm text-zinc-500 font-medium">
                            {categoryProducts.length} Modelle verfügbar
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-500">Vergleichen:</span>
                                <button className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </button>
                            </div>

                            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-500">Sortieren nach:</span>
                                <button className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white hover:text-brand-teal transition-colors">
                                    Standard
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoryProducts.length > 0 ? (
                        categoryProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col"
                            >
                                {/* Top: Image Area */}
                                <div className="relative h-[260px] p-6 flex items-center justify-center overflow-hidden">
                                    {/* Decorative circle blur for depth */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />

                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-xl"
                                    />

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
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <Filter className="w-12 h-12 mb-4 text-zinc-300" />
                            <p className="text-lg font-medium">Keine Produkte verfügbar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
