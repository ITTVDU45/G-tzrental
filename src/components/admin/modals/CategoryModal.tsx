"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Reorder } from "framer-motion";
import ImagePicker from "../ImagePicker";


interface Category {
    id: string;
    name: string;
    image: string;
    link: string;
    count: number;
    description?: string;
    parentCategory?: string; // ID of parent category
    tags?: { id: string; text: string }[];
}

interface CategoryModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (category: Partial<Category>) => void;
    category?: Category | null;
    allCategories: Category[]; // To select parent category
}

export default function CategoryModal({ isOpen, onCloseAction, onSaveAction, category, allCategories }: CategoryModalProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        name: "",
        image: "",
        link: "",
        count: 0,
        description: "",
        parentCategory: "",
        tags: []
    });

    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        setNewTag("");
        if (category) {
            setFormData({
                ...category,
                tags: category.tags || []
            });
        } else {
            setFormData({
                name: "",
                image: "",
                link: "",
                count: 0,
                description: "",
                parentCategory: "",
                tags: []
            });
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const addTag = () => {
        if (newTag.trim()) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), { id: Date.now().toString(), text: newTag }]
            });
            setNewTag("");
        }
    };

    const removeTag = (id: string) => {
        setFormData({
            ...formData,
            tags: (formData.tags || []).filter(t => t.id !== id)
        });
    };

    const handleReorderTags = (newOrder: { id: string; text: string }[]) => {
        setFormData({ ...formData, tags: newOrder });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {category ? "Kategorie bearbeiten" : "Neue Kategorie"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Verwalten Sie Details, Struktur und Inhalte.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Übergeordnete Kategorie</label>
                                <select
                                    value={formData.parentCategory || ""}
                                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                >
                                    <option value="">Keine (Hauptkategorie)</option>
                                    {allCategories
                                        .filter(c => c.id !== category?.id) // Prevent selecting self as parent
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ImagePicker
                                label="Kategoriebild"
                                value={formData.image || ''}
                                onChangeAction={(url: string) => setFormData({ ...formData, image: url })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Beschreibung</label>
                        <textarea
                            rows={3}
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                            placeholder="Beschreiben Sie diese Kategorie..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tags (SEO & Filter)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                placeholder="Tag hinzufügen..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl w-12 flex items-center justify-center hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 min-h-[80px]">
                            <Reorder.Group axis="y" values={formData.tags || []} onReorder={handleReorderTags} className="space-y-2">
                                {formData.tags?.map((tag) => (
                                    <Reorder.Item key={tag.id} value={tag}>
                                        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-between cursor-grab active:cursor-grabbing group">
                                            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{tag.text}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag.id)}
                                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                                {(!formData.tags || formData.tags.length === 0) && (
                                    <p className="text-center text-zinc-400 text-xs py-2">Keine Tags vorhanden.</p>
                                )}
                            </Reorder.Group>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4 border-t border-zinc-50 dark:border-zinc-800 mt-6 pt-6">
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
