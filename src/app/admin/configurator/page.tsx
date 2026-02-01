"use client";

import { useState, useEffect } from "react";
import { Info, Sliders, Tag, ShoppingCart, Plus, Search, Trash2, X, Edit2, Check } from "lucide-react";
import ImagePicker from "@/components/admin/ImagePicker";
import { Dialog } from "@headlessui/react";

interface TabButtonProps {
    id: 'settings' | 'filters' | 'extras' | 'upselling';
    icon: any;
    label: string;
    active: string;
    set: (id: 'settings' | 'filters' | 'extras' | 'upselling') => void;
}

const TabButton = ({ id, icon: Icon, label, active, set }: TabButtonProps) => (
    <button
        onClick={() => set(id)}
        className={`
            flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold transition-colors
            ${active === id
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }
        `}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    priceType: 'fixed' | 'daily';
    image?: string;
    categoryIds?: string[];
}

interface Product {
    id: string;
    name: string;
    category: string;
    image?: string;
}

interface Category {
    id: string;
    name: string;
    image?: string;
    link?: string;
}

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    id: string;
    type: 'slider' | 'select' | 'radio' | 'checkbox';
    key: string;
    label: string;
    // Slider props
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    defaultValue?: number | string;
    // Options
    options?: FilterOption[];
}

export default function ConfiguratorAdminPage() {
    const [activeTab, setActiveTab] = useState<'settings' | 'filters' | 'extras' | 'upselling'>('settings');

    // Real Data - Filters
    const [activeFilters, setActiveFilters] = useState<FilterConfig[]>([]);

    // Edit State for Filters
    const [editingFilter, setEditingFilter] = useState<FilterConfig | null>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Real Data State - Categories (Settings)
    const [catalogCategories, setCatalogCategories] = useState<Category[]>([]);
    const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Real Data State - Extras
    const [catalogAddons, setCatalogAddons] = useState<AddOn[]>([]);
    const [activeAddonIds, setActiveAddonIds] = useState<string[]>([]);
    const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

    // Real Data State - Upselling
    const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
    const [activeUpsellingIds, setActiveUpsellingIds] = useState<string[]>([]);
    const [isUpsellingDropdownOpen, setIsUpsellingDropdownOpen] = useState(false);

    // Mock data for other tabs (preserved) - Sliders is now activeFilters but keeping for safe migration if needed
    const [sliders, setSliders] = useState([
        { key: "height", name: "Arbeitshöhe", min: 0, max: 60, default: 12 },
        { key: "reach", name: "Reichweite", min: 0, max: 30, default: 8 },
        { key: "load", name: "Korblast", min: 0, max: 1000, default: 200 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [addonsRes, activeExtrasRes, productsRes, activeUpsellingRes, catsRes, activeCatsRes, filtersRes] = await Promise.all([
                    fetch('/api/admin/addons'),
                    fetch('/api/admin/configurator/extras'),
                    fetch('/api/admin/products'),
                    fetch('/api/admin/configurator/upselling'),
                    fetch('/api/admin/categories'),
                    fetch('/api/admin/configurator/categories'),
                    fetch('/api/admin/configurator/filters')
                ]);

                if (addonsRes.ok) setCatalogAddons(await addonsRes.json());
                // ... others
                if (filtersRes.ok) setActiveFilters(await filtersRes.json());
                // ... same as before
                if (activeExtrasRes.ok) setActiveAddonIds(await activeExtrasRes.json());
                if (productsRes.ok) setCatalogProducts(await productsRes.json());
                if (activeUpsellingRes.ok) setActiveUpsellingIds(await activeUpsellingRes.json());
                if (catsRes.ok) setCatalogCategories(await catsRes.json());
                if (activeCatsRes.ok) setActiveCategoryIds(await activeCatsRes.json());

            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);

    // ... helper functions

    const handleSaveFilters = async (filters: FilterConfig[]) => {
        setActiveFilters(filters);
        try {
            await fetch('/api/admin/configurator/filters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
        } catch (err) {
            console.error("Failed to save filters", err);
        }
    };

    const handleUpdateFilter = (updatedFilter: FilterConfig) => {
        const newFilters = activeFilters.map(f => f.id === updatedFilter.id ? updatedFilter : f);
        handleSaveFilters(newFilters);
        setEditingFilter(null);
        setIsFilterModalOpen(false);
    };

    const handleCreateFilter = (newFilter: FilterConfig) => {
        handleSaveFilters([...activeFilters, newFilter]);
        setIsFilterModalOpen(false);
    };

    const handleDeleteFilter = (id: string) => {
        handleSaveFilters(activeFilters.filter(f => f.id !== id));
    };

    const openNewFilterModal = () => {
        setEditingFilter({
            id: `f-${Date.now()}`,
            type: 'select',
            key: `field_${Date.now()}`,
            label: 'Neue Anforderung',
            options: [{ label: 'Option 1', value: 'opt1' }]
        });
        setIsFilterModalOpen(true);
    };

    // ... render return ...


    // Derived State - Categories
    const activeCategories = activeCategoryIds
        .map(id => catalogCategories.find(c => c.id === id))
        .filter(Boolean) as Category[];
    const availableCategories = catalogCategories.filter(c => !activeCategoryIds.includes(c.id));

    // Derived State - Extras
    const activeExtras = activeAddonIds
        .map(id => catalogAddons.find(a => a.id === id))
        .filter(Boolean) as AddOn[];
    const availableExtras = catalogAddons.filter(a => !activeAddonIds.includes(a.id));

    // Derived State - Upselling
    const activeUpselling = activeUpsellingIds
        .map(id => catalogProducts.find(p => p.id === id))
        .filter(Boolean) as Product[];
    const availableUpselling = catalogProducts.filter(p => !activeUpsellingIds.includes(p.id));

    const updateActiveCategories = async (newIds: string[]) => {
        setActiveCategoryIds(newIds);
        try {
            await fetch('/api/admin/configurator/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: newIds })
            });
        } catch (err) {
            console.error("Failed to save category configuration", err);
        }
    };

    const updateActiveExtras = async (newIds: string[]) => {
        setActiveAddonIds(newIds);
        try {
            await fetch('/api/admin/configurator/extras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: newIds })
            });
        } catch (err) {
            console.error("Failed to save extras configuration", err);
        }
    };

    const updateActiveUpselling = async (newIds: string[]) => {
        setActiveUpsellingIds(newIds);
        try {
            await fetch('/api/admin/configurator/upselling', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: newIds })
            });
        } catch (err) {
            console.error("Failed to save upselling configuration", err);
        }
    };

    const handleAddCategory = (id: string) => {
        updateActiveCategories([...activeCategoryIds, id]);
        setIsCategoryDropdownOpen(false);
    };

    const handleRemoveCategory = (id: string) => {
        updateActiveCategories(activeCategoryIds.filter(x => x !== id));
    };

    const handleAddExtra = (id: string) => {
        updateActiveExtras([...activeAddonIds, id]);
        setIsAddDropdownOpen(false);
    };

    const handleRemoveExtra = (id: string) => {
        updateActiveExtras(activeAddonIds.filter(x => x !== id));
    };

    const handleAddUpselling = (id: string) => {
        updateActiveUpselling([...activeUpsellingIds, id]);
        setIsUpsellingDropdownOpen(false);
    };

    const handleRemoveUpselling = (id: string) => {
        updateActiveUpselling(activeUpsellingIds.filter(x => x !== id));
    };

    return (
        <div className="p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Konfigurator</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Verwalte Schritte, Filter und Zusatzleistungen für den Miet-Konfigurator.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-brand-teal text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-teal/90 transition-colors shadow-lg shadow-brand-teal/20">
                        Einstellungen speichern
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                <TabButton id="settings" icon={Info} label="Allgemein" active={activeTab} set={setActiveTab} />
                <TabButton id="filters" icon={Sliders} label="Filter & Slider" active={activeTab} set={setActiveTab} />
                <TabButton id="extras" icon={Tag} label="Zusatzleistungen" active={activeTab} set={setActiveTab} />
                <TabButton id="upselling" icon={ShoppingCart} label="Upselling" active={activeTab} set={setActiveTab} />
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 relative z-0">

                {activeTab === 'settings' && (
                    <div className="space-y-10">
                        {/* Categories Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center relative">
                                <div>
                                    <h2 className="text-xl font-bold">Start-Kategorien</h2>
                                    <p className="text-zinc-500 text-sm mt-1">Wähle die Kategorien aus, die im ersten Schritt angezeigt werden.</p>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className="flex items-center gap-2 text-sm font-bold bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Kategorie für Startseite
                                    </button>

                                    {isCategoryDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
                                            <div className="p-3 border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                                <p className="text-xs font-bold text-zinc-500 uppercase">Verfügbare Kategorien</p>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {availableCategories.length > 0 ? (
                                                    availableCategories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => handleAddCategory(cat.id)}
                                                            className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 flex items-center gap-3"
                                                        >
                                                            {cat.image ? (
                                                                <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-zinc-100" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold">?</div>
                                                            )}
                                                            <div className="font-bold text-sm text-zinc-900 dark:text-white">{cat.name}</div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-zinc-400">
                                                        Keine weiteren Kategorien verfügbar.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeCategories.map(cat => (
                                    <div key={cat.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 shadow-lg hover:shadow-xl transition-all">
                                        <div className="absolute inset-0">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                            <div className="bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-auto">
                                                Ab 120 €
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                            <p className="text-zinc-300 text-xs line-clamp-2">Flexible Mietoptionen verfügbar</p>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveCategory(cat.id)}
                                            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {activeCategories.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                        Bitte Kategorien auswählen.
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-zinc-200 dark:border-zinc-800" />

                        <div className="max-w-2xl space-y-6">
                            <h2 className="text-xl font-bold">System Einstellungen</h2>
                            <div className="flex flex-col gap-4">
                                <label className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                    <span className="font-bold">Konfigurator aktivieren/sperren</span>
                                    <input type="checkbox" className="toggle toggle-accent" defaultChecked />
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                    <span className="font-bold">Preise anzeigen</span>
                                    <input type="checkbox" className="toggle toggle-accent" defaultChecked />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'filters' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Anforderungen & Filter</h2>
                                <p className="text-zinc-500 text-sm mt-1">Definiere die Fragen und Eingabefelder für Schritt 2 (Anforderungen).</p>
                            </div>
                            <button
                                onClick={openNewFilterModal}
                                className="bg-brand-teal text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-teal/90 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Neues Feld
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {activeFilters.map((filter, index) => (
                                <div key={filter.id} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl flex items-center justify-between group shadow-sm hover:border-brand-teal/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-zinc-200 dark:bg-zinc-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-zinc-500 text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white">{filter.label}</h3>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded uppercase font-bold tracking-wider">
                                                    {filter.type}
                                                </span>
                                                <span className="text-xs text-zinc-400 font-mono">Key: {filter.key}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingFilter(filter); setIsFilterModalOpen(true); }}
                                            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-zinc-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFilter(filter.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group/delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-zinc-400 group-hover/delete:text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {activeFilters.length === 0 && (
                                <div className="text-center py-12 text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                    Noch keine Filter definiert.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'extras' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center relative">
                            <div>
                                <h2 className="text-xl font-bold">Zusatzprodukte im Konfigurator</h2>
                                <p className="text-zinc-500 text-sm mt-1">Diese Leistungen werden dem Kunden im Schritt 4 angezeigt.</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-bold bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Aus Katalog hinzufügen
                                </button>

                                {isAddDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
                                        <div className="p-3 border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                            <p className="text-xs font-bold text-zinc-500 uppercase">Verfügbare Add-ons</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {availableExtras.length > 0 ? (
                                                availableExtras.map(addon => (
                                                    <button
                                                        key={addon.id}
                                                        onClick={() => handleAddExtra(addon.id)}
                                                        className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                                    >
                                                        <div className="font-bold text-sm text-zinc-900 dark:text-white">{addon.name}</div>
                                                        <div className="text-xs text-zinc-500 flex justify-between">
                                                            <span>{addon.id}</span>
                                                            <span className="font-mono">{addon.price}€</span>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-zinc-400">
                                                    Keine weiteren Add-ons verfügbar.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* List of active extras */}
                        <ul className="space-y-3">
                            {activeExtras.map(extra => (
                                <li key={extra.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-sm hover:border-brand-teal/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold block text-zinc-900 dark:text-white">{extra.name}</span>
                                            <span className="text-xs text-zinc-400">ID: {extra.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-mono text-sm font-bold bg-zinc-50 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                                            {extra.price}€
                                            <span className="text-zinc-400 font-normal ml-1">
                                                {extra.priceType === 'daily' ? "/ Tag" : ""}
                                            </span>
                                        </span>
                                        <button
                                            onClick={() => handleRemoveExtra(extra.id)}
                                            className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Empty State Hint */}
                        {activeExtras.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                <p className="text-zinc-400 font-medium">Noch keine Zusatzleistungen aktiviert.</p>
                                <button
                                    onClick={() => setIsAddDropdownOpen(true)}
                                    className="text-brand-teal font-bold text-sm mt-2 hover:underline"
                                >
                                    Jetzt aus Katalog hinzufügen
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'upselling' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center relative">
                            <div>
                                <h2 className="text-xl font-bold">Upselling Produkte</h2>
                                <p className="text-zinc-500 text-sm mt-1">Diese Produkte werden dem Nutzer vor dem Absenden der Anfrage vorgeschlagen.</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsUpsellingDropdownOpen(!isUpsellingDropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-bold bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Aus Katalog hinzufügen
                                </button>

                                {isUpsellingDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
                                        <div className="p-3 border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                            <p className="text-xs font-bold text-zinc-500 uppercase">Verfügbare Produkte</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {availableUpselling.length > 0 ? (
                                                availableUpselling.map(product => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => handleAddUpselling(product.id)}
                                                        className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 flex items-center gap-3"
                                                    >
                                                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {product.image ? (
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ShoppingCart className="w-4 h-4 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{product.name}</div>
                                                            <div className="text-xs text-zinc-500">{product.category || "Keine Kategorie"}</div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-zinc-400">
                                                    Keine weiteren Produkte verfügbar.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeUpselling.map(product => (
                                <div key={product.id} className="p-4 border-2 border-brand-teal bg-brand-teal/5 rounded-2xl flex items-center gap-4 relative group">
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ShoppingCart className="w-6 h-6 text-zinc-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{product.name}</h4>
                                        <p className="text-xs text-zinc-500">{product.category || "Standard"}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <span className="text-brand-teal text-xs font-bold bg-white px-2 py-1 rounded">Aktiv</span>
                                        <button
                                            onClick={() => handleRemoveUpselling(product.id)}
                                            className="p-1.5 bg-white text-zinc-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {activeUpselling.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                <p className="text-zinc-400 font-medium">Noch keine Upselling-Produkte aktiviert.</p>
                                <button
                                    onClick={() => setIsUpsellingDropdownOpen(true)}
                                    className="text-brand-teal font-bold text-sm mt-2 hover:underline"
                                >
                                    Jetzt aus Katalog hinzufügen
                                </button>
                            </div>
                        )}
                    </div>
                )}


            </div>

            {/* Filter Modal */}
            <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                        {editingFilter && (
                            <div className="space-y-8">
                                <div>
                                    <Dialog.Title className="text-2xl font-bold">Feld konfigurieren</Dialog.Title>
                                    <p className="text-zinc-500 text-sm mt-1">Passe die Einstellungen für diese Anforderung an.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Bezeichnung (Label)</label>
                                        <input
                                            type="text"
                                            value={editingFilter.label}
                                            onChange={e => setEditingFilter({ ...editingFilter, label: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                            placeholder="z.B. Arbeitshöhe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Technischer Key</label>
                                        <input
                                            type="text"
                                            value={editingFilter.key}
                                            onChange={e => setEditingFilter({ ...editingFilter, key: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                            placeholder="z.B. max_height"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block">Eingabetyp</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['slider', 'select', 'radio', 'checkbox'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setEditingFilter({ ...editingFilter, type: type as any })}
                                                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${editingFilter.type === type ? 'bg-brand-teal text-white border-brand-teal shadow-lg shadow-brand-teal/20' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-brand-teal/50'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editingFilter.type === 'slider' && (
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl space-y-6 border border-zinc-100 dark:border-zinc-800">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Min</label>
                                                <input type="number" value={editingFilter.min || 0} onChange={e => setEditingFilter({ ...editingFilter, min: Number(e.target.value) })} className="w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Max</label>
                                                <input type="number" value={editingFilter.max || 100} onChange={e => setEditingFilter({ ...editingFilter, max: Number(e.target.value) })} className="w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Schritt</label>
                                                <input type="number" value={editingFilter.step || 1} onChange={e => setEditingFilter({ ...editingFilter, step: Number(e.target.value) })} className="w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 text-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Einheit</label>
                                                <input type="text" value={editingFilter.unit || ''} onChange={e => setEditingFilter({ ...editingFilter, unit: e.target.value })} className="w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 text-sm" placeholder="z.B. m, kg, %" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Standardwert</label>
                                                <input type="number" value={editingFilter.defaultValue as number || 0} onChange={e => setEditingFilter({ ...editingFilter, defaultValue: Number(e.target.value) })} className="w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {['select', 'radio', 'checkbox'].includes(editingFilter.type) && (
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl space-y-4 border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Antwort-Optionen</label>
                                            <button
                                                onClick={() => setEditingFilter({ ...editingFilter, options: [...(editingFilter.options || []), { label: '', value: '' }] })}
                                                className="text-xs font-bold text-brand-teal hover:bg-brand-teal/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Option hinzufügen
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {editingFilter.options?.map((opt, i) => (
                                                <div key={i} className="flex gap-3 group/opt">
                                                    <div className="flex-1 space-y-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Anzeige-Text"
                                                            value={opt.label}
                                                            onChange={e => {
                                                                const newOpt = [...(editingFilter.options || [])];
                                                                newOpt[i].label = e.target.value;
                                                                setEditingFilter({ ...editingFilter, options: newOpt });
                                                            }}
                                                            className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2.5 text-sm focus:border-brand-teal outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Interner Wert"
                                                            value={opt.value}
                                                            onChange={e => {
                                                                const newOpt = [...(editingFilter.options || [])];
                                                                newOpt[i].value = e.target.value;
                                                                setEditingFilter({ ...editingFilter, options: newOpt });
                                                            }}
                                                            className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2.5 text-sm font-mono focus:border-brand-teal outline-none transition-all"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newOpt = editingFilter.options?.filter((_, idx) => idx !== i);
                                                            setEditingFilter({ ...editingFilter, options: newOpt });
                                                        }}
                                                        className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!editingFilter.options || editingFilter.options.length === 0) && (
                                                <div className="text-center py-6 text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                    Klicke auf "Option hinzufügen", um Auswahlmöglichkeiten zu erstellen.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <button
                                        onClick={() => setIsFilterModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold text-zinc-500 transition-colors"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={() => activeFilters.some(f => f.id === editingFilter.id) ? handleUpdateFilter(editingFilter) : handleCreateFilter(editingFilter)}
                                        className="bg-brand-teal text-white px-8 py-2.5 rounded-xl font-bold hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20 transition-all"
                                    >
                                        Speichern
                                    </button>
                                </div>
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
