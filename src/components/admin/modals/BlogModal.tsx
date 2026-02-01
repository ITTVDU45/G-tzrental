"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import ImagePicker from "../ImagePicker";
import RichTextEditor from "../RichTextEditor";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    status: string;
    pageIds?: string[];
    content?: string;
    categories?: string[];
    tags?: string[];
}

interface BlogModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSaveAction: (post: Partial<BlogPost>) => void;
    post?: BlogPost | null;
    pages: { id: string; title: string }[];
}

export default function BlogModal({ isOpen, onCloseAction, onSaveAction, post, pages }: BlogModalProps) {
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: "",
        excerpt: "",
        image: "",
        category: "Ratgeber",
        date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
        readTime: "5 min",
        status: "draft",
        pageIds: [],
        content: "",
        categories: ["Ratgeber"],
        tags: []
    });
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (post) {
            setFormData({
                ...post,
                pageIds: post.pageIds || [],
                categories: post.categories || [post.category].filter(Boolean) || ["Ratgeber"],
                content: post.content || "",
                tags: post.tags || []
            });
        } else {
            setFormData({
                title: "",
                excerpt: "",
                image: "",
                category: "Ratgeber",
                date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
                readTime: "5 min",
                status: "draft",
                pageIds: [],
                categories: ["Ratgeber"],
                content: "",
                tags: []
            });
        }
        setTagInput("");
    }, [post, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction(formData);
    };

    const toggleCategory = (cat: string) => {
        const currentCats = formData.categories || [];
        if (currentCats.includes(cat)) {
            setFormData({ ...formData, categories: currentCats.filter(c => c !== cat) });
        } else {
            setFormData({ ...formData, categories: [...currentCats, cat] });
        }
    };

    const togglePage = (pageId: string) => {
        const currentPages = formData.pageIds || [];
        if (currentPages.includes(pageId)) {
            setFormData({ ...formData, pageIds: currentPages.filter(id => id !== pageId) });
        } else {
            setFormData({ ...formData, pageIds: [...currentPages, pageId] });
        }
    };

    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !(formData.tags || []).includes(trimmedTag)) {
            setFormData({ ...formData, tags: [...(formData.tags || []), trimmedTag] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== tag) });
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {post ? "Beitrag bearbeiten" : "Neuer Beitrag"}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">Teilen Sie Fachwissen und News.</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Titel</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            placeholder="z.B. Die richtige Arbeitsbühne wählen"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Kategorien</label>

                            {/* Selected Categories */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(formData.categories || []).map(cat => (
                                    <div key={cat} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-xs font-bold">{cat}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(cat)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <select
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        toggleCategory(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                            >
                                <option value="">Kategorie hinzufügen...</option>
                                {["Ratgeber", "Sicherheit", "News", "Technik", "Innovation", "Tutorial"]
                                    .filter(c => !(formData.categories || []).includes(c))
                                    .map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            >
                                <option value="draft">Entwurf</option>
                                <option value="published">Veröffentlicht</option>
                            </select>
                        </div>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Lesezeit</label>
                            <input
                                type="text"
                                value={formData.readTime}
                                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                placeholder="z.B. 5 min"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Datum</label>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Schlagwörter (Tags)</label>

                        {/* Tags Badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(formData.tags || []).map(tag => (
                                <div key={tag} className="bg-gradient-to-r from-brand-teal/10 to-brand-teal/5 text-brand-teal border border-brand-teal/30 px-3 py-1.5 rounded-full flex items-center gap-2 group transition-all hover:border-brand-teal/50 hover:shadow-md hover:shadow-brand-teal/10">
                                    <span className="text-xs font-bold">#{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {(formData.tags || []).length === 0 && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1 italic py-2">Keine Tags hinzugefügt</p>
                            )}
                        </div>

                        {/* Tag Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                placeholder="Tag eingeben und Enter drücken..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-6 py-4 rounded-2xl bg-brand-teal/10 text-brand-teal border border-brand-teal/20 font-bold text-sm hover:bg-brand-teal/20 transition-all"
                            >
                                Hinzufügen
                            </button>
                        </div>
                    </div>

                    <ImagePicker
                        label="Beitragsbild"
                        value={formData.image || ''}
                        onChangeAction={(url: string) => setFormData({ ...formData, image: url })}
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Vorschautext (Excerpt)</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                            placeholder="Kurze Zusammenfassung für die Übersicht..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Beitragstext (Content)</label>
                        <RichTextEditor
                            value={formData.content || ""}
                            onChangeAction={(content) => setFormData({ ...formData, content })}
                        />
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
