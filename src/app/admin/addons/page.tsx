"use client";

import { Plus, Search, Edit2, Trash2, Tag, Check, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import ImagePicker from "@/components/admin/ImagePicker";
import { useState, useEffect } from "react";

// Mock Data Type
interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    priceType: 'fixed' | 'daily' | 'one-time';
    image?: string;
    categoryIds: string[]; // IDs of categories this addon applies to (or empty for all)
    productIds?: string[];
}

// Initial Mock Data (would come from API)
// const INITIAL_ADDONS: AddOn[] = ... (Removed, using API)

export default function AddonsPage() {
    const [addons, setAddons] = useState<AddOn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentAddon, setCurrentAddon] = useState<Partial<AddOn>>({});

    // Real Data State
    const [availableCategories, setAvailableCategories] = useState<{ id: string, name: string }[]>([]);
    const [availableProducts, setAvailableProducts] = useState<{ id: string, name: string }[]>([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [addonsRes, catsRes, prodsRes] = await Promise.all([
                    fetch('/api/admin/addons'),
                    fetch('/api/admin/categories'),
                    fetch('/api/admin/products')
                ]);

                if (addonsRes.ok) {
                    const data = await addonsRes.json();
                    setAddons(data);
                }

                if (catsRes.ok) {
                    const cats = await catsRes.json();
                    setAvailableCategories(cats);
                }

                if (prodsRes.ok) {
                    const prods = await prodsRes.json();
                    setAvailableProducts(prods);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Filter logic
    const filteredAddons = addons.filter(addon =>
        addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        if (!currentAddon.name) return; // Basic validation

        try {
            const res = await fetch('/api/admin/addons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentAddon)
            });

            if (res.ok) {
                const savedAddon = await res.json();
                if (currentAddon.id) {
                    setAddons(addons.map(a => a.id === savedAddon.id ? savedAddon : a));
                } else {
                    setAddons([...addons, savedAddon]);
                }
                setIsEditModalOpen(false);
                setCurrentAddon({});
            }
        } catch (err) {
            console.error("Failed to save addon", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Wirklich löschen?")) return;

        try {
            const res = await fetch('/api/admin/addons', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setAddons(addons.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete addon", err);
        }
    };

    const openEdit = (addon?: AddOn) => {
        setCurrentAddon(addon || { priceType: 'one-time', price: 0 });
        setIsEditModalOpen(true);
        // Reset search states
        setCategorySearch("");
        setProductSearch("");
        setShowCategoryDropdown(false);
        setShowProductDropdown(false);
    };

    return (
        <div className="p-8 min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Zusatzleistungen</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Zentrale Verwaltung aller verfügbaren Add-ons für den Konfigurator.
                    </p>
                </div>
                <button
                    onClick={() => openEdit()}
                    className="flex items-center gap-2 bg-brand-teal text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal/90 transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Neues Add-on
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAddons.map(addon => (
                    <div key={addon.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brand-teal/10 rounded-xl text-brand-teal h-14 w-14 flex items-center justify-center overflow-hidden relative">
                                {addon.image ? (
                                    <img src={addon.image} alt={addon.name} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <Tag className="w-6 h-6" />
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(addon)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-brand-teal transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(addon.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{addon.name}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                            {addon.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Preis</span>
                                <span className="font-bold text-zinc-900 dark:text-white">
                                    {addon.price === 0 ? "Kostenlos" : `${addon.price}€`}
                                    <span className="text-xs font-normal text-zinc-400 ml-1">
                                        {addon.priceType === 'daily' ? "/ Tag" : "Pauschale"}
                                    </span>
                                </span>
                            </div>
                            {addon.categoryIds.length > 0 && (
                                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs rounded-md font-medium">
                                    {addon.categoryIds.length} Kategorien
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-8 pb-4">
                            <Dialog.Title className="text-2xl font-bold">
                                {currentAddon.id ? "Add-on bearbeiten" : "Neues Add-on erstellen"}
                            </Dialog.Title>
                        </div>

                        <div className="px-8 pb-4 overflow-y-auto flex-1 min-h-0">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-brand-teal/20 outline-none"
                                        value={currentAddon.name || ""}
                                        onChange={e => setCurrentAddon({ ...currentAddon, name: e.target.value })}
                                        placeholder="z.B. Sicherheitsgurt"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Beschreibung</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 h-24 resize-none focus:ring-2 focus:ring-brand-teal/20 outline-none"
                                        value={currentAddon.description || ""}
                                        onChange={e => setCurrentAddon({ ...currentAddon, description: e.target.value })}
                                        placeholder="Kurze Beschreibung der Leistung..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Preis (€)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                                            value={currentAddon.price || 0}
                                            onChange={e => setCurrentAddon({ ...currentAddon, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Preistyp</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                                            value={currentAddon.priceType || 'one-time'}
                                            onChange={e => setCurrentAddon({ ...currentAddon, priceType: e.target.value as any })}
                                        >
                                            <option value="one-time">Einmalig / Pauschale</option>
                                            <option value="daily">Pro Tag</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <ImagePicker
                                        label="Bild"
                                        value={currentAddon.image || ""}
                                        onChangeAction={(url: string) => setCurrentAddon({ ...currentAddon, image: url })}
                                    />
                                </div>

                                <div className="space-y-6">
                                    {/* Categories Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Kategorien zuordnen (nur existierende)
                                        </label>
                                        <div className="min-h-[42px] p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                                            {currentAddon.categoryIds?.map(catId => {
                                                const cat = availableCategories.find(c => c.id === catId);
                                                return (
                                                    <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-teal/10 text-brand-teal text-sm font-bold group">
                                                        {cat ? cat.name : catId}
                                                        <button
                                                            onClick={() => setCurrentAddon({
                                                                ...currentAddon,
                                                                categoryIds: currentAddon.categoryIds?.filter(id => id !== catId)
                                                            })}
                                                            className="hover:bg-brand-teal/20 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                            <div className="relative flex-1 min-w-[120px]">
                                                <input
                                                    type="text"
                                                    placeholder={currentAddon.categoryIds?.length ? "" : "Kategorie suchen..."}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-1 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                                                    value={categorySearch}
                                                    onChange={(e) => {
                                                        setCategorySearch(e.target.value);
                                                        setShowCategoryDropdown(true);
                                                    }}
                                                    onFocus={() => setShowCategoryDropdown(true)}
                                                    onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                                                />
                                                {showCategoryDropdown && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 max-h-48 overflow-y-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50">
                                                        {availableCategories
                                                            .filter(c =>
                                                                !currentAddon.categoryIds?.includes(c.id) &&
                                                                c.name.toLowerCase().includes(categorySearch.toLowerCase())
                                                            )
                                                            .map(cat => (
                                                                <button
                                                                    key={cat.id}
                                                                    onClick={() => {
                                                                        setCurrentAddon({
                                                                            ...currentAddon,
                                                                            categoryIds: [...(currentAddon.categoryIds || []), cat.id]
                                                                        });
                                                                        setCategorySearch("");
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition-colors"
                                                                >
                                                                    {cat.name}
                                                                </button>
                                                            ))}
                                                        {availableCategories.filter(c => !currentAddon.categoryIds?.includes(c.id) && c.name.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                                                            <div className="px-4 py-2 text-sm text-zinc-400 italic">Keine Ergebnisse</div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                                    <Search className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Spezifische Produkte (nur existierende)
                                        </label>
                                        <div className="min-h-[42px] p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                                            {currentAddon.productIds?.map(prodId => {
                                                const prod = availableProducts.find(p => p.id === prodId);
                                                return (
                                                    <span key={prodId} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-bold">
                                                        {prod ? prod.name : prodId}
                                                        <button
                                                            onClick={() => setCurrentAddon({
                                                                ...currentAddon,
                                                                productIds: currentAddon.productIds?.filter(id => id !== prodId)
                                                            })}
                                                            className="hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                            <div className="relative flex-1 min-w-[120px]">
                                                <input
                                                    type="text"
                                                    placeholder={currentAddon.productIds?.length ? "" : "Produkt suchen..."}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-1 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                                                    value={productSearch}
                                                    onChange={(e) => {
                                                        setProductSearch(e.target.value);
                                                        setShowProductDropdown(true);
                                                    }}
                                                    onFocus={() => setShowProductDropdown(true)}
                                                    onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
                                                />
                                                {showProductDropdown && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 max-h-48 overflow-y-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50">
                                                        {availableProducts
                                                            .filter(p =>
                                                                !currentAddon.productIds?.includes(p.id) &&
                                                                p.name.toLowerCase().includes(productSearch.toLowerCase())
                                                            )
                                                            .map(prod => (
                                                                <button
                                                                    key={prod.id}
                                                                    onClick={() => {
                                                                        setCurrentAddon({
                                                                            ...currentAddon,
                                                                            productIds: [...(currentAddon.productIds || []), prod.id]
                                                                        });
                                                                        setProductSearch("");
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition-colors"
                                                                >
                                                                    {prod.name}
                                                                </button>
                                                            ))}
                                                        {availableProducts.filter(p => !currentAddon.productIds?.includes(p.id) && p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                                                            <div className="px-4 py-2 text-sm text-zinc-400 italic">Keine Ergebnisse</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="p-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 mt-auto bg-white dark:bg-zinc-900 rounded-b-3xl">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                Abbrechen
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 rounded-xl font-bold bg-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:bg-brand-teal/90 transition-colors">
                                Speichern
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
