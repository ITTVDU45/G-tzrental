"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import ImagePicker from "../ImagePicker";

interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    image: string;
    description: string;
    price: number;
    details: {
        height?: string;
        reach?: string;
        load?: string;
        power?: string;
        weight?: string;
        [key: string]: string | undefined;
    };
}

interface ProductModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (product: Partial<Product>) => void;
    product?: Product | null;
    categories: string[];
}

export default function ProductModal({ isOpen, onCloseAction, onSaveAction, product, categories }: ProductModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        category: "",
        subcategory: "",
        image: "",
        description: "",
        price: 0,
        details: {
            height: "",
            reach: "",
            load: "",
            power: ""
        }
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: "",
                category: categories[0] || "",
                subcategory: "",
                image: "",
                description: "",
                price: 0,
                details: {
                    height: "",
                    reach: "",
                    load: "",
                    power: ""
                }
            });
        }
    }, [product, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    const updateDetail = (key: string, value: string) => {
        setFormData({
            ...formData,
            details: {
                ...formData.details,
                [key]: value
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {product ? "Produkt bearbeiten" : "Neues Produkt"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Verwalten Sie Geräatedaten und technische Spezifikationen.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Produktname</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                    placeholder="z.B. MB 80-E"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Kategorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Unterkategorie</label>
                                    <input
                                        type="text"
                                        value={formData.subcategory}
                                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                        placeholder="z.B. Mastbühne"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Preis (€ / Tag)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ImagePicker
                                label="Produktbild"
                                value={formData.image || ''}
                                onChangeAction={(url: string) => setFormData({ ...formData, image: url })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Beschreibung</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all h-32"
                            placeholder="Kurze Beschreibung des Geräts..."
                        />
                    </div>

                    {/* Technical Details */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-4">
                            Technische Daten
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                            <div className="space-y-2">
                                <label className="text-zinc-400 uppercase text-[9px]">Arbeitshöhe</label>
                                <input
                                    type="text"
                                    value={formData.details?.height || ""}
                                    onChange={(e) => updateDetail("height", e.target.value)}
                                    placeholder="8,20 m"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-zinc-400 uppercase text-[9px]">Reichweite</label>
                                <input
                                    type="text"
                                    value={formData.details?.reach || ""}
                                    onChange={(e) => updateDetail("reach", e.target.value)}
                                    placeholder="2,65 m"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-zinc-400 uppercase text-[9px]">Tragkraft</label>
                                <input
                                    type="text"
                                    value={formData.details?.load || ""}
                                    onChange={(e) => updateDetail("load", e.target.value)}
                                    placeholder="200 kg"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-zinc-400 uppercase text-[9px]">Antrieb</label>
                                <input
                                    type="text"
                                    value={formData.details?.power || ""}
                                    onChange={(e) => updateDetail("power", e.target.value)}
                                    placeholder="Elektro"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t border-zinc-50 dark:border-zinc-800 flex gap-4 shrink-0">
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
