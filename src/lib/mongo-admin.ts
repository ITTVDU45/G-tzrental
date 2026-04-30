import { Collection } from "mongodb";
import { readDb } from "@/lib/db";
import { getDb } from "@/lib/mongodb";
import { I_Any, I_AdminDoc } from "@/lib/types";
import { products as mockProducts } from "@/data/mockProducts";

export const COLLECTIONS = {
    products: "products",
    categories: "categories",
    blog: "blog",
    addons: "addons",
    pages: "pages",
    locations: "locations",
    testimonials: "testimonials",
    inquiries: "inquiries",
    configuratorExtras: "configurator_extras",
    configuratorCategories: "configurator_categories",
    configuratorFilters: "configurator_filters",
    configuratorUpselling: "configurator_upselling",
} as const;

const DEFAULT_CATEGORIES = [
    { id: "cat-1", name: "Arbeitsbühnen", image: "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen", count: 12 },
    { id: "cat-2", name: "Stapler", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600", link: "/mieten/stapler", count: 8 },
    { id: "cat-3", name: "Baumaschinen", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600", link: "/mieten/baumaschinen", count: 5 },
];

const DEFAULT_BLOG = [
    {
        id: "arbeitssicherheit-2024",
        title: "Arbeitssicherheit auf Baustellen: Die wichtigsten Regeln 2024",
        excerpt: "Erfahren Sie, welche Sicherheitsvorschriften beim Einsatz von Arbeitsbühnen unbedingt beachtet werden müssen.",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800",
        category: "Sicherheit",
        date: "15. Januar 2024",
        readTime: "5 min",
        status: "published",
    },
    {
        id: "richtige-arbeitsbuehne",
        title: "Die richtige Arbeitsbühne für Ihr Projekt wählen",
        excerpt: "Schere, Teleskop oder Gelenkbühne? Wir zeigen Ihnen, welche Bühne für welchen Einsatz am besten geeignet ist.",
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800",
        category: "Ratgeber",
        date: "10. Januar 2024",
        readTime: "7 min",
        status: "published",
    },
];

const DEFAULT_ADDONS = [
    { id: "ao-1", name: "Haftungsbefreiung", description: "Reduziert den Selbstbehalt im Schadensfall.", price: 15, priceType: "daily", categoryIds: [] },
    { id: "ao-2", name: "Bedienerschulung", description: "Einweisung durch zertifiziertes Personal.", price: 99, priceType: "one-time", categoryIds: [] },
    { id: "ao-3", name: "Sicherheitsgurt PSA", description: "Pflicht für Hubarbeitsbühnen.", price: 0, priceType: "one-time", categoryIds: ["cat-platforms"] },
    { id: "ao-4", name: "Extra Schlüssel", description: "Zweitschlüssel für das Mietgerät.", price: 5, priceType: "one-time", categoryIds: [] },
];

const DEFAULT_PAGES = [
    { id: "page-1", title: "Startseite", slug: "/", status: "published", lastModified: "2024-01-30" },
    { id: "page-2", title: "Mietpark", slug: "/mieten", status: "published", lastModified: "2024-01-28" },
    { id: "page-3", title: "Unternehmen", slug: "/unternehmen/ueber-uns", status: "published", lastModified: "2024-01-25" },
    { id: "page-4", title: "Kontakt", slug: "/kontakt", status: "published", lastModified: "2024-01-20" },
];

const DEFAULT_TESTIMONIALS = [
    {
        id: 1,
        name: "Thomas Weber",
        role: "Bauleiter, Hochbau GmbH",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
        text: "Die Anlieferung der Arbeitsbühnen war pünktlich auf die Minute. Die Geräte waren in top Zustand und die Einweisung durch das Personal war vorbildlich. Für uns die erste Wahl in der Region.",
        rating: "5.0 Stars",
    },
    {
        id: 2,
        name: "Sarah Müller",
        role: "Architektin",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
        text: "Wir brauchten kurzfristig eine Spezialbühne für Fassadenarbeiten. GoetzRental hat uns innerhalb von 2 Stunden geholfen. Dieser Service ist heutzutage nicht selbstverständlich.",
        rating: "5.0 Stars",
    },
    {
        id: 3,
        name: "Michael Klein",
        role: "Landschaftsbauer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
        text: "Faire Preise und transparente Abrechnung. Besonders die unkomplizierte Rückgabe gefällt uns sehr gut. Wir mieten hier unsere Bagger und Radlader regelmäßig.",
        rating: "5.0 Stars",
    },
    {
        id: 4,
        name: "Andreas Meyer",
        role: "Projektleiter",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
        text: "Hervorragende Beratung bei der Auswahl der richtigen Hebebühne. Das Team ist kompetent und sehr freundlich. Absolute Empfehlung für jeden Bauherren.",
        rating: "5.0 Stars",
    },
];

const DEFAULT_CONFIGURATOR_FILTERS = [
    { id: "f-height", type: "slider", key: "height", label: "Arbeitshöhe", unit: "m", min: 0, max: 60, step: 1, defaultValue: 12 },
    { id: "f-reach", type: "slider", key: "reach", label: "Reichweite", unit: "m", min: 0, max: 30, step: 1, defaultValue: 8 },
    { id: "f-load", type: "slider", key: "load", label: "Korblast", unit: "kg", min: 0, max: 1000, step: 50, defaultValue: 200 },
    {
        id: "f-drive",
        type: "select",
        key: "drive",
        label: "Antriebsart",
        options: [
            { value: "e", label: "Elektro (Innen)" },
            { value: "d", label: "Diesel (Außen)" },
            { value: "h", label: "Hybrid" },
        ],
    },
    {
        id: "f-ground",
        type: "select",
        key: "ground",
        label: "Untergrund",
        options: [
            { value: "flat", label: "Eben / Fest" },
            { value: "rough", label: "Gelände / Uneben" },
        ],
    },
    {
        id: "f-env",
        type: "select",
        key: "environment",
        label: "Einsatzort",
        options: [
            { value: "indoor", label: "Innen" },
            { value: "outdoor", label: "Außen" },
        ],
    },
];

function stripMongoId<T extends I_AdminDoc>(doc: T): T {
    if (!doc || typeof doc !== "object") return doc;
    const cloned = { ...doc };
    delete cloned._id;
    return cloned as T;
}

function cloneData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

function dedupeDocsByBusinessId<T extends I_AdminDoc>(docs: T[]) {
    const docsById = new Map<I_Any, T>();
    const uniqueDocs: T[] = [];

    docs.forEach((doc) => {
        const normalizedDoc = stripMongoId(doc);
        if (!normalizedDoc?.id) {
            uniqueDocs.push(normalizedDoc);
            return;
        }

        docsById.set(normalizedDoc.id, normalizedDoc);
    });

    return [...uniqueDocs, ...Array.from(docsById.values())];
}

async function getLegacySeed(key: string, fallback: I_Any[] = []) {
    const db = await readDb();
    const legacyValue = db?.[key];
    if (Array.isArray(legacyValue) && legacyValue.length > 0) {
        return cloneData(legacyValue);
    }
    return cloneData(fallback);
}

export async function getCollection(name: string): Promise<Collection<I_AdminDoc>> {
    const db = await getDb();
    return db.collection<I_AdminDoc>(name);
}

export async function ensureListCollectionSeeded(name: string, legacyKey: string, fallback: I_Any[] = []) {
    const collection = await getCollection(name);
    const count = await collection.countDocuments();

    if (count === 0) {
        const seed = await getLegacySeed(legacyKey, fallback);
        if (seed.length > 0) {
            await collection.insertMany(seed.map((item) => stripMongoId(item)));
        }
    }

    return collection;
}

export async function listSeededCollection(name: string, legacyKey: string, fallback: I_Any[] = []) {
    const collection = await ensureListCollectionSeeded(name, legacyKey, fallback);
    const docs = await collection.find({}).toArray();
    return dedupeDocsByBusinessId(docs.map((doc) => stripMongoId(doc)));
}

export async function upsertByBusinessId(
    name: string,
    doc: I_AdminDoc,
    createId: () => I_Any
) {
    const collection = await getCollection(name);
    const nextDoc = stripMongoId(cloneData(doc));

    if (!nextDoc.id) {
        nextDoc.id = createId();
    }

    await collection.updateOne(
        { id: nextDoc.id },
        { $set: nextDoc },
        { upsert: true }
    );

    return nextDoc;
}

export async function deleteByBusinessId(name: string, id: I_Any) {
    const collection = await getCollection(name);
    await collection.deleteOne({ id });
}

export async function countCollection(name: string, legacyKey: string, fallback: I_Any[] = []) {
    const collection = await ensureListCollectionSeeded(name, legacyKey, fallback);
    return collection.countDocuments();
}

export async function ensureConfigSeeded(name: string, key: string, field: string, defaultValue: I_Any) {
    const collection = await getCollection(name);
    const existing = await collection.findOne({ key });

    if (!existing) {
        const seeded = { key, [field]: cloneData(defaultValue) };
        await collection.insertOne(seeded);
        return seeded;
    }

    return stripMongoId(existing);
}

export async function getConfigValue(name: string, key: string, field: string, defaultValue: I_Any) {
    const config = await ensureConfigSeeded(name, key, field, defaultValue);
    return config[field] ?? cloneData(defaultValue);
}

export async function setConfigValue(name: string, key: string, field: string, value: I_Any) {
    const collection = await getCollection(name);
    await collection.updateOne(
        { key },
        { $set: { key, [field]: cloneData(value) } },
        { upsert: true }
    );
    return value;
}

export async function seedProducts() {
    return ensureListCollectionSeeded(COLLECTIONS.products, "products", mockProducts);
}

export async function seedCategories() {
    return ensureListCollectionSeeded(COLLECTIONS.categories, "categories", DEFAULT_CATEGORIES);
}

export async function seedBlog() {
    return ensureListCollectionSeeded(COLLECTIONS.blog, "blog", []);
}

export async function seedAddons() {
    return ensureListCollectionSeeded(COLLECTIONS.addons, "addons", DEFAULT_ADDONS);
}

export async function seedPages() {
    return ensureListCollectionSeeded(COLLECTIONS.pages, "pages", DEFAULT_PAGES);
}

export async function seedLocations() {
    return ensureListCollectionSeeded(COLLECTIONS.locations, "locations", []);
}

export async function seedTestimonials() {
    return ensureListCollectionSeeded(COLLECTIONS.testimonials, "testimonials", DEFAULT_TESTIMONIALS);
}

export async function seedInquiries() {
    return ensureListCollectionSeeded(COLLECTIONS.inquiries, "inquiries", []);
}

export async function seedConfiguratorExtras() {
    const legacy = await readDb();
    const defaultIds = Array.isArray(legacy?.configuratorExtras) && legacy.configuratorExtras.length > 0
        ? legacy.configuratorExtras
        : ["ao-1", "ao-2", "ao-3"];
    return ensureConfigSeeded(COLLECTIONS.configuratorExtras, "activeIds", "ids", defaultIds);
}

export async function seedConfiguratorCategories() {
    const legacy = await readDb();
    let defaultIds = Array.isArray(legacy?.configuratorCategories) ? legacy.configuratorCategories : [];
    if (defaultIds.length === 0) {
        const categories = await listSeededCollection(COLLECTIONS.categories, "categories", DEFAULT_CATEGORIES);
        defaultIds = categories.slice(0, 3).map((item) => item.id);
    }
    return ensureConfigSeeded(COLLECTIONS.configuratorCategories, "activeIds", "ids", defaultIds);
}

export async function seedConfiguratorFilters() {
    const legacy = await readDb();
    const defaultFilters = Array.isArray(legacy?.configuratorFilters) && legacy.configuratorFilters.length > 0
        ? legacy.configuratorFilters
        : DEFAULT_CONFIGURATOR_FILTERS;
    return ensureConfigSeeded(COLLECTIONS.configuratorFilters, "filters", "items", defaultFilters);
}

export async function seedConfiguratorUpselling() {
    const legacy = await readDb();
    const defaultIds = Array.isArray(legacy?.configuratorUpselling) ? legacy.configuratorUpselling : [];
    return ensureConfigSeeded(COLLECTIONS.configuratorUpselling, "activeIds", "ids", defaultIds);
}

export async function ensureAdminMongoSeeded() {
    await Promise.all([
        seedProducts(),
        seedCategories(),
        seedBlog(),
        seedAddons(),
        seedPages(),
        seedLocations(),
        seedTestimonials(),
        seedInquiries(),
        seedConfiguratorExtras(),
        seedConfiguratorCategories(),
        seedConfiguratorFilters(),
        seedConfiguratorUpselling(),
    ]);
}

export async function getCmsPayload() {
    const [
        products,
        categories,
        blog,
        addons,
        pages,
        locations,
        testimonials,
        inquiries,
        configuratorExtras,
        configuratorCategories,
        configuratorFilters,
        configuratorUpselling,
    ] = await Promise.all([
        listSeededCollection(COLLECTIONS.products, "products", mockProducts),
        listSeededCollection(COLLECTIONS.categories, "categories", DEFAULT_CATEGORIES),
        listSeededCollection(COLLECTIONS.blog, "blog", DEFAULT_BLOG),
        listSeededCollection(COLLECTIONS.addons, "addons", DEFAULT_ADDONS),
        listSeededCollection(COLLECTIONS.pages, "pages", DEFAULT_PAGES),
        listSeededCollection(COLLECTIONS.locations, "locations", []),
        listSeededCollection(COLLECTIONS.testimonials, "testimonials", DEFAULT_TESTIMONIALS),
        listSeededCollection(COLLECTIONS.inquiries, "inquiries", []),
        getConfigValue(COLLECTIONS.configuratorExtras, "activeIds", "ids", ["ao-1", "ao-2", "ao-3"]),
        getConfigValue(COLLECTIONS.configuratorCategories, "activeIds", "ids", []),
        getConfigValue(COLLECTIONS.configuratorFilters, "filters", "items", DEFAULT_CONFIGURATOR_FILTERS),
        getConfigValue(COLLECTIONS.configuratorUpselling, "activeIds", "ids", []),
    ]);

    return {
        products,
        categories,
        blog,
        addons,
        pages,
        locations,
        testimonials,
        inquiries,
        configuratorExtras,
        configuratorCategories,
        configuratorFilters,
        configuratorUpselling,
    };
}
