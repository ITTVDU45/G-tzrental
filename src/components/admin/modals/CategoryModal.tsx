"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ImagePicker from "../ImagePicker";

interface Category {
    id: string;
    name: string;
    image: string;
    link: string;
    count: number;
}

interface CategoryModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (category: Partial<Category>) => void;
    category?: Category | null;
}

export default function CategoryModal({ isOpen, onCloseAction, onSaveAction, category }: CategoryModalProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        name: "",
        image: "",
        link: "",
        count: 0
    });

    useEffect(() => {
        if (category) {
            setFormData(category);
        } else {
            setFormData({
                name: "",
                image: "",
                link: "",
                count: 0
            });
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {category ? "Kategorie bearbeiten" : "Neue Kategorie"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Geben Sie die Basisdaten der Kategorie ein.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Kategoriename</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                const link = `/mieten/${name.toLowerCase().replace(/\s+/g, "-")}`;
                                setFormData({ ...formData, name, link });
                            }}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            placeholder="z.B. Scherenbühnen"
                        />
                    </div>

                    <ImagePicker
                        label="Bild"
                        value={formData.image || ''}
                        onChangeAction={(url: string) => setFormData({ ...formData, image: url })}
                    />

                    <div className="pt-4 flex gap-4">
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
