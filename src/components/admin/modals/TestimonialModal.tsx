"use client";

import { useState, useEffect } from "react";
import { X, Star, ChevronDown } from "lucide-react";
import ImagePicker from "../ImagePicker";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    text: string;
    rating: string;
    pageIds?: string[];
}

interface TestimonialModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (testimonial: Partial<Testimonial>) => void;
    testimonial?: Testimonial | null;
    pages: { id: string; title: string }[];
}

export default function TestimonialModal({ isOpen, onCloseAction, onSaveAction, testimonial, pages }: TestimonialModalProps) {
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: "",
        role: "",
        image: "",
        text: "",
        rating: "5.0 Stars",
        pageIds: []
    });

    useEffect(() => {
        if (testimonial) {
            setFormData({
                ...testimonial,
                pageIds: testimonial.pageIds || [] // Ensure array
            });
        } else {
            setFormData({
                name: "",
                role: "",
                image: "",
                text: "",
                rating: "5.0 Stars",
                pageIds: []
            });
        }
    }, [testimonial, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    const togglePage = (pageId: string) => {
        const currentPages = formData.pageIds || [];
        if (currentPages.includes(pageId)) {
            setFormData({ ...formData, pageIds: currentPages.filter(id => id !== pageId) });
        } else {
            setFormData({ ...formData, pageIds: [...currentPages, pageId] });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {testimonial ? "Testimonial bearbeiten" : "Neues Testimonial"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Verwalten Sie Kundenfeedback.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Kundenname</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Rolle / Firma</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Bewertung</label>
                        <select
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                        >
                            <option value="5.0 Stars">5.0 Sterne</option>
                            <option value="4.5 Stars">4.5 Sterne</option>
                            <option value="4.0 Stars">4.0 Sterne</option>
                            <option value="3.5 Stars">3.5 Sterne</option>
                            <option value="3.0 Stars">3.0 Sterne</option>
                            <option value="2.5 Stars">2.5 Sterne</option>
                            <option value="2.0 Stars">2.0 Sterne</option>
                            <option value="1.5 Stars">1.5 Sterne</option>
                            <option value="1.0 Stars">1.0 Sterne</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Anzeigen auf Seiten</label>

                        {/* Selected Pages Badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(formData.pageIds || []).map(id => {
                                const page = pages.find(p => p.id === id);
                                if (!page) return null;
                                return (
                                    <div key={id} className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-3 py-1.5 rounded-full flex items-center gap-2 group transition-all hover:bg-brand-teal/20">
                                        <span className="text-xs font-bold">{page.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => togglePage(id)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                            {(formData.pageIds || []).length === 0 && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1 italic py-2">Wird auf allen Seiten angezeigt</p>
                            )}
                        </div>

                        {/* Dropdown Selection */}
                        <div className="relative">
                            <select
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold appearance-none cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        togglePage(e.target.value);
                                        e.target.value = ""; // Reset selector
                                    }
                                }}
                            >
                                <option value="">Seite hinzufügen...</option>
                                {pages
                                    .filter(p => !(formData.pageIds || []).includes(p.id))
                                    .map(page => (
                                        <option key={page.id} value={page.id}>{page.title}</option>
                                    ))
                                }
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                            </div>
                        </div>
                    </div>

                    <ImagePicker
                        label="Profilbild"
                        value={formData.image || ''}
                        onChangeAction={(url: string) => setFormData({ ...formData, image: url })}
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Testimonial Text</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-4 border-t border-zinc-50 dark:border-zinc-800 mt-6 pt-6 shrink-0">
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
