"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText } from "lucide-react";
import { Reorder } from "framer-motion";
import ImagePicker from "../ImagePicker";
import FilePicker from "../FilePicker";

interface DetailItem {
    id: string;
    label: string;
    value: string;
}

interface ProductDocument {
    id: string;
    name: string;
    url: string;
}

interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    image: string;
    description: string;
    insuranceText?: string;
    insuranceBadges?: { id: string; text: string }[];
    price: number;
    datasheet?: string;
    datasheetName?: string;
    documents?: ProductDocument[];
    details: any; // Allow array or legacy object
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
        insuranceText: "",
        insuranceBadges: [],
        price: 0,
        datasheet: "",
        datasheetName: "",
        documents: [],
        details: []
    });

    const [detailsList, setDetailsList] = useState<DetailItem[]>([]);
    const [documentsList, setDocumentsList] = useState<ProductDocument[]>([]);
    const [newBadge, setNewBadge] = useState("");
    const [newDocName, setNewDocName] = useState("");
    const [newDocUrl, setNewDocUrl] = useState("");

    useEffect(() => {
        setNewBadge(""); // Reset new badge input
        if (product) {
            setFormData({
                ...product,
                insuranceBadges: product.insuranceBadges || []
            });

            // Convert details to array if it's an object (legacy support)
            if (product.details && !Array.isArray(product.details)) {
                const legacyDetails: DetailItem[] = [];
                // Map standard keys to nice labels
                const labelMap: Record<string, string> = {
                    height: "Arbeitshöhe",
                    reach: "Reichweite",
                    load: "Tragkraft",
                    power: "Antrieb",
                    weight: "Gewicht",
                    transportWidth: "Breite"
                };

                Object.entries(product.details).forEach(([key, value]) => {
                    if (value) {
                        legacyDetails.push({
                            id: key, // Use key as simple ID
                            label: labelMap[key] || key,
                            value: String(value)
                        });
                    }
                });
                setDetailsList(legacyDetails);
            } else if (Array.isArray(product.details)) {
                setDetailsList(product.details);
            } else {
                setDetailsList([]);
            }
            if (product.documents && Array.isArray(product.documents)) {
                setDocumentsList(product.documents);
            } else if (product.datasheet) {
                setDocumentsList([{
                    id: 'legacy-datasheet',
                    name: product.datasheetName || 'Datenblatt',
                    url: product.datasheet
                }]);
            } else {
                setDocumentsList([]);
            }
        } else {
            setFormData({
                name: "",
                category: categories[0] || "",
                subcategory: "",
                image: "",
                description: "",
                insuranceText: "",
                insuranceBadges: [],
                price: 0,
                datasheet: "",
                datasheetName: "",
                details: []
            });
            setDetailsList([
                { id: "d1", label: "Arbeitshöhe", value: "" },
                { id: "d2", label: "Reichweite", value: "" },
                { id: "d3", label: "Tragkraft", value: "" },
                { id: "d4", label: "Antrieb", value: "" },
            ]);
            setDocumentsList([]);
        }
        setNewDocName("");
        setNewDocUrl("");
    }, [product, isOpen, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAction({
            ...formData,
            details: detailsList, // Save as array
            documents: documentsList
        });
    };

    const addDetail = () => {
        setDetailsList([...detailsList, { id: Date.now().toString(), label: "", value: "" }]);
    };

    const removeDetail = (id: string) => {
        setDetailsList(detailsList.filter(d => d.id !== id));
    };

    const updateDetailItem = (id: string, field: 'label' | 'value', value: string) => {
        setDetailsList(detailsList.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    const addBadge = () => {
        if (newBadge.trim()) {
            setFormData({
                ...formData,
                insuranceBadges: [...(formData.insuranceBadges || []), { id: Date.now().toString(), text: newBadge }]
            });
            setNewBadge("");
        }
    };

    const removeBadge = (id: string) => {
        setFormData({
            ...formData,
            insuranceBadges: (formData.insuranceBadges || []).filter(b => b.id !== id)
        });
    };

    const handleReorder = (newOrder: { id: string; text: string }[]) => {
        setFormData({ ...formData, insuranceBadges: newOrder });
    };

    const addDocument = () => {
        if (newDocUrl) {
            setDocumentsList([...documentsList, {
                id: Date.now().toString(),
                name: newDocName || "Dokument",
                url: newDocUrl
            }]);
            setNewDocName("");
            setNewDocUrl("");
        }
    };

    const removeDocument = (id: string) => {
        setDocumentsList(documentsList.filter(d => d.id !== id));
    };

    const updateDocumentName = (id: string, name: string) => {
        setDocumentsList(documentsList.map(d => d.id === id ? { ...d, name: name } : d));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onCloseAction}>
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
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

                    {/* Insurance & Protection */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-4">
                            Versicherung & Schutz
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Info-Text</label>
                                <textarea
                                    rows={3}
                                    value={formData.insuranceText || ""}
                                    onChange={(e) => setFormData({ ...formData, insuranceText: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all h-32 resize-none"
                                    placeholder="Informationen zur Versicherung..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Badges (Drag & Drop)</label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newBadge}
                                        onChange={(e) => setNewBadge(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                                        className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                        placeholder="Badge hinzufügen..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addBadge}
                                        className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl w-12 flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 min-h-[100px]">
                                    <Reorder.Group axis="y" values={formData.insuranceBadges || []} onReorder={handleReorder} className="space-y-2">
                                        {formData.insuranceBadges?.map((badge) => (
                                            <Reorder.Item key={badge.id} value={badge}>
                                                <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-between cursor-grab active:cursor-grabbing group">
                                                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{badge.text}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBadge(badge.id)}
                                                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                        {(!formData.insuranceBadges || formData.insuranceBadges.length === 0) && (
                                            <p className="text-center text-zinc-400 text-xs py-4">Keine Badges vorhanden.</p>
                                        )}
                                    </Reorder.Group>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-4">
                                Technische Daten
                            </h3>
                            <button
                                type="button"
                                onClick={addDetail}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-brand-teal transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                Feld hinzufügen
                            </button>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                            <Reorder.Group axis="y" values={detailsList} onReorder={setDetailsList} className="space-y-2">
                                {detailsList.map((detail) => (
                                    <Reorder.Item key={detail.id} value={detail}>
                                        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4 cursor-grab active:cursor-grabbing group">
                                            <div className="grid grid-cols-2 gap-4 flex-1">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide ml-1">Label</label>
                                                    <input
                                                        type="text"
                                                        value={detail.label}
                                                        onChange={(e) => updateDetailItem(detail.id, 'label', e.target.value)}
                                                        placeholder="z.B. Arbeitshöhe"
                                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide ml-1">Wert</label>
                                                    <input
                                                        type="text"
                                                        value={detail.value}
                                                        onChange={(e) => updateDetailItem(detail.id, 'value', e.target.value)}
                                                        placeholder="z.B. 12 m"
                                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDetail(detail.id)}
                                                className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                                {detailsList.length === 0 && (
                                    <p className="text-center text-zinc-400 text-xs py-8">Keine technischen Daten vorhanden.</p>
                                )}
                            </Reorder.Group>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-4">
                                Dokumente
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {/* Document List */}
                            {documentsList.length > 0 && (
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 space-y-2">
                                    <Reorder.Group axis="y" values={documentsList} onReorder={setDocumentsList} className="space-y-2">
                                        {documentsList.map((doc) => (
                                            <Reorder.Item key={doc.id} value={doc}>
                                                <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4 cursor-grab active:cursor-grabbing group">
                                                    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-brand-teal shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <input
                                                            type="text"
                                                            value={doc.name}
                                                            onChange={(e) => updateDocumentName(doc.id, e.target.value)}
                                                            className="w-full bg-transparent text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:underline"
                                                            placeholder="Dokument Name"
                                                        />
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] text-zinc-400 font-medium hover:text-brand-teal truncate block"
                                                        >
                                                            {doc.url.split('/').pop()}
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(doc.id)}
                                                        className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </div>
                            )}

                            {/* Add New Document */}
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Neues Dokument hinzufügen</h4>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Bezeichnung</label>
                                        <input
                                            type="text"
                                            value={newDocName}
                                            onChange={(e) => setNewDocName(e.target.value)}
                                            placeholder="z.B. Datenblatt DE"
                                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold"
                                        />
                                    </div>
                                    <FilePicker
                                        label="PDF Auswählen"
                                        value={newDocUrl}
                                        onChangeAction={setNewDocUrl}
                                        accept="application/pdf"
                                    />

                                    <button
                                        type="button"
                                        onClick={addDocument}
                                        disabled={!newDocUrl}
                                        className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Dokument hinzufügen
                                    </button>
                                </div>
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
