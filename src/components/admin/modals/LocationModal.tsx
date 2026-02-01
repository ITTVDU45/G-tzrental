"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface Location {
    id: string;
    name: string;
    status: string;
    productIds?: string[];
    lastModified: string;
}

interface Product {
    id: string;
    name: string;
}

interface LocationModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (location: Partial<Location>) => void;
    location?: Location | null;
    products: Product[];
}

export default function LocationModal({ isOpen, onCloseAction, onSaveAction, location, products }: LocationModalProps) {
    const [formData, setFormData] = useState<Partial<Location>>({
        name: "",
        status: "published",
        productIds: [],
        lastModified: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (location) {
            setFormData({
                ...location,
                productIds: location.productIds || []
            });
        } else {
            setFormData({
                name: "",
                status: "published",
                productIds: [],
                lastModified: new Date().toISOString().split('T')[0]
            });
        }
    }, [location, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    const toggleProduct = (productId: string) => {
        const currentProducts = formData.productIds || [];
        if (currentProducts.includes(productId)) {
            setFormData({ ...formData, productIds: currentProducts.filter(id => id !== productId) });
        } else {
            setFormData({ ...formData, productIds: [...currentProducts, productId] });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {location ? "Standort bearbeiten" : "Neuer Standort"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Verwalten Sie Standorte und deren Produkte.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Standortname</label>
                        <input
                            type="text"
                            required
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            placeholder="z.B. Düsseldorf"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                        >
                            <option value="published">Veröffentlicht</option>
                            <option value="draft">Entwurf</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Produkte zuweisen</label>

                        {/* Selected Products Badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(formData.productIds || []).map(id => {
                                const product = products.find(p => p.id === id);
                                if (!product) return null;
                                return (
                                    <div key={id} className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-3 py-1.5 rounded-full flex items-center gap-2 group transition-all hover:bg-brand-teal/20">
                                        <span className="text-xs font-bold">{product.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleProduct(id)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                            {(formData.productIds || []).length === 0 && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1 italic py-2">Keine Produkte zugewiesen</p>
                            )}
                        </div>

                        {/* Dropdown Selection */}
                        <div className="relative">
                            <select
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold appearance-none cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        toggleProduct(e.target.value);
                                        e.target.value = ""; // Reset selector
                                    }
                                }}
                            >
                                <option value="">Produkt hinzufügen...</option>
                                {products
                                    .filter(p => !(formData.productIds || []).includes(p.id))
                                    .map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))
                                }
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4 shrink-0">
                        <button
                            type="button"
                            onClick={onCloseAction}
                            className="flex-1 py-4 px-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-500 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 px-6 rounded-2xl bg-brand-teal text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20"
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
