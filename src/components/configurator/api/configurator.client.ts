import { ConfiguratorData, RecommendationResult } from "../state/configurator.types";

// Keep static fallback/defaults for things not yet dynamic
const STATIC_DEFAULTS = {
    location: { id: "loc-1", slug: "duesseldorf", name: "Düsseldorf" },
    deviceTypes: [
        { id: "dt-1", categoryId: "cat-2", label: "Scherenbühne", iconKey: "scissor", description: "Ideal für senkrechte Arbeiten im Innenbereich." },
        { id: "dt-2", categoryId: "cat-3", label: "Gelenkteleskop", iconKey: "boom", description: "Perfekt für schwer zugängliche Stellen." },
        { id: "dt-1", categoryId: "cat-1", label: "Teleskopbühne", iconKey: "boom", description: "Für maximale Höhe und Reichweite." },
        { id: "dt-1", categoryId: "cat-4", label: "Mastbühne", iconKey: "scissor", description: "Kompakt für enge Gänge." },
        { id: "dt-3", categoryId: "cat-5", label: "Frontstapler", iconKey: "forklift", description: "Klassiker für den Palettentransport." },
    ],
    filters: {
        items: [
            { id: "f-height", key: "height", label: "Arbeitshöhe", type: "slider" as const, unit: "m", min: 0, max: 60, step: 1, defaultValue: 12 },
            { id: "f-reach", key: "reach", label: "Reichweite", type: "slider" as const, unit: "m", min: 0, max: 30, step: 1, defaultValue: 8 },
            { id: "f-load", key: "load", label: "Korblast", type: "slider" as const, unit: "kg", min: 0, max: 1000, step: 50, defaultValue: 200 },
            { id: "f-drive", key: "drive", label: "Antriebsart", type: "select" as const, options: [{ value: "e", label: "Elektro (Innen)" }, { value: "d", label: "Diesel (Außen)" }, { value: "h", label: "Hybrid" }] },
            { id: "f-ground", key: "ground", label: "Untergrund", type: "select" as const, options: [{ value: "flat", label: "Eben / Fest" }, { value: "rough", label: "Gelände / Uneben" }] },
            { id: "f-env", key: "environment", label: "Einsatzort", type: "select" as const, options: [{ value: "indoor", label: "Innen" }, { value: "outdoor", label: "Außen" }] }
        ]
    },
    steps: [
        { key: "category", title: "Kategorie", required: true, order: 1 },
        { key: "requirements", title: "Anforderungen", required: true, order: 2 },
        { key: "device", title: "Gerätetyp", required: true, order: 3 },
        { key: "extras", title: "Zusatzleistungen", required: false, order: 4 },
        { key: "contact", title: "Daten & Kontakt", required: true, order: 5 },
        { key: "summary", title: "Anfrage senden", required: true, order: 6 },
    ]
};

const MOCK_PRODUCTS: RecommendationResult = {
    suitableDeviceTypes: [
        { id: "dt-1", label: "Scherenbühne" },
        { id: "dt-2", label: "Gelenkteleskop" }
    ],
    products: [
        {
            id: "p-1",
            title: "SB 120 E",
            deviceTypeId: "dt-1",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000",
            specs: { maxHeight: 12, maxReach: 0, maxLoad: 350 },
            badges: ["Top Seller", "Elektro"],
            price: 115
        },
        {
            id: "p-2",
            title: "GTB 160 D",
            deviceTypeId: "dt-2",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000",
            specs: { maxHeight: 16, maxReach: 10, maxLoad: 230 },
            badges: ["4x4 Allrad"],
            price: 180
        }
    ]
};

export async function fetchConfiguratorData(locationSlug: string): Promise<ConfiguratorData> {
    try {
        const [
            catsRes, activeCatsRes,
            addonsRes, activeExtrasRes,
            productsRes, activeUpsellingRes,
            filtersRes
        ] = await Promise.all([
            fetch('/api/admin/categories', { cache: 'no-store' }),
            fetch('/api/admin/configurator/categories', { cache: 'no-store' }),
            fetch('/api/admin/addons', { cache: 'no-store' }),
            fetch('/api/admin/configurator/extras', { cache: 'no-store' }),
            fetch('/api/admin/products', { cache: 'no-store' }),
            fetch('/api/admin/configurator/upselling', { cache: 'no-store' }),
            fetch('/api/admin/configurator/filters', { cache: 'no-store' })
        ]);

        const allCats = catsRes.ok ? await catsRes.json() : [];
        const activeCatIds = activeCatsRes.ok ? await activeCatsRes.json() : [];

        const allAddons = addonsRes.ok ? await addonsRes.json() : [];
        const activeExtraIds = activeExtrasRes.ok ? await activeExtrasRes.json() : [];

        const allProducts = productsRes.ok ? await productsRes.json() : [];
        const activeUpsellingIds = activeUpsellingRes.ok ? await activeUpsellingRes.json() : [];

        let activeFilters = filtersRes.ok ? await filtersRes.json() : STATIC_DEFAULTS.filters.items;
        if (!Array.isArray(activeFilters) && (activeFilters as any)?.value) {
            activeFilters = (activeFilters as any).value;
        }

        // Map Categories
        const categories = activeCatIds
            .map((id: string) => allCats.find((c: any) => c.id === id))
            .filter(Boolean)
            .map((c: any) => ({
                id: c.id,
                label: c.name,
                iconKey: "default",
                image: c.image
            }));

        // Map Extras
        const extras = activeExtraIds
            .map((id: string) => allAddons.find((a: any) => a.id === id))
            .filter(Boolean)
            .map((a: any) => ({
                id: a.id,
                key: a.id,
                label: a.name,
                description: a.description,
                priceHint: a.price === 0 ? "inklusive" : `+${a.price}€${a.priceType === 'daily' ? '/Tag' : ''}`,
                price: a.price || 0,
                priceType: a.priceType || 'one-time'
            }));

        // Map Upselling
        const upsellingProducts = activeUpsellingIds
            .map((id: string) => allProducts.find((p: any) => p.id === id))
            .filter(Boolean)
            .map((p: any) => ({
                id: p.id,
                title: p.name,
                deviceTypeId: "misc",
                image: p.image || "https://images.unsplash.com/photo-1596484552880-ff69c9a45d09?auto=format",
                specs: { maxHeight: 0, maxReach: 0, maxLoad: 0 },
                badges: ["Tipp"],
                price: p.price || 0
            }));

        return {
            ...STATIC_DEFAULTS,
            location: { ...STATIC_DEFAULTS.location, slug: locationSlug, name: locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1) },
            categories,
            filters: { items: activeFilters },
            extras,
            upsellingProducts
        };

    } catch (e) {
        console.error("CRITICAL: Fetch Configurator Data Error", e);
        // Fallback to static if API fails
        return {
            ...STATIC_DEFAULTS,
            categories: [],
            filters: STATIC_DEFAULTS.filters,
            extras: [],
            upsellingProducts: [],
            location: { ...STATIC_DEFAULTS.location, slug: locationSlug }
        };
    }
}

export async function fetchRecommendations(criteria: any): Promise<RecommendationResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PRODUCTS);
        }, 600);
    });
}

export async function submitLead(data: any): Promise<{ leadId: string; status: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("LEAD SUBMITTED:", data);
            resolve({ leadId: "LEAD-" + Math.floor(Math.random() * 10000), status: "received" });
        }, 1200);
    });
}
