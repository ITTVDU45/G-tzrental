"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Check, ChevronDown, Search } from "lucide-react";
import { products, type Product } from "@/data/mockProducts";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (product: Product) => void;
}

const filters = {
    categories: ["Alle", "Arbeitsbühnen", "Stapler", "Baumaschinen", "Gerüste"],
    power: ["Alle", "Diesel", "Elektro", "Hybrid"],
};

export function ProductSelector({ isOpen, onClose, onSelect }: ProductSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState("Alle");
    const [selectedPower, setSelectedPower] = useState("Alle");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === "Alle" || product.category === selectedCategory;
        const matchesPower = selectedPower === "Alle" || product.details.power === selectedPower;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPower && matchesSearch;
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-4 md:inset-10 md:top-20 z-[70] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto"
                    >
                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full md:hidden z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Sidebar Filters */}
                        <div className={cn(
                            "w-full md:w-80 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto transition-all",
                            showFilters ? "block" : "hidden md:flex"
                        )}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Filter</h3>
                                <button onClick={() => {
                                    setSelectedCategory("Alle");
                                    setSelectedPower("Alle");
                                    setSearchQuery("");
                                }} className="text-sm text-brand-teal hover:underline cursor-pointer">
                                    Zurücksetzen
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Suchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                                />
                            </div>

                            {/* Categories */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700">Kategorie</h4>
                                <div className="flex flex-col gap-2">
                                    {filters.categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                selectedCategory === cat
                                                    ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                                    : "hover:bg-gray-200 text-gray-600"
                                            )}
                                        >
                                            {cat}
                                            {selectedCategory === cat && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Power */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700">Antrieb</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filters.power.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setSelectedPower(p)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                                selectedPower === p
                                                    ? "bg-brand-green border-brand-green text-white"
                                                    : "border-gray-300 text-gray-600 hover:border-brand-green hover:text-brand-green"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-dark">Produktwahl</h2>
                                    <p className="text-gray-500 text-sm">{filteredProducts.length} Ergebnisse gefunden</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProducts.map(product => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-teal/30 transition-all duration-300 flex flex-col"
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-brand-teal shadow-sm">
                                                        {product.category}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 flex flex-col flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-brand-teal transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    {/* Specs */}
                                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-500 my-3">
                                                        {product.details.height && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
                                                                AH: {product.details.height}
                                                            </div>
                                                        )}
                                                        {product.details.load && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                                                                TK: {product.details.load}
                                                            </div>
                                                        )}
                                                        {product.details.reach && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                                RW: {product.details.reach}
                                                            </div>
                                                        )}
                                                        <div className="font-medium text-gray-700">
                                                            {product.details.power}
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                        <div className="text-lg font-bold text-brand-dark">
                                                            {product.price}€ <span className="text-xs font-normal text-gray-400">/Tag</span>
                                                        </div>
                                                        <button
                                                            onClick={() => onSelect?.(product)}
                                                            className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal transition-colors shadow-lg shadow-brand-dark/10"
                                                        >
                                                            Auswählen
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Search className="w-12 h-12 text-gray-200 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">Keine Produkte gefunden</h3>
                                        <p className="text-gray-500">Versuchen Sie es mit anderen Filtereinstellungen.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
