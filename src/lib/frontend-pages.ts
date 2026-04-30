import { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, listSeededCollection } from "@/lib/mongo-admin";
import { products as mockProducts } from "@/data/mockProducts";
import { I_AdminDoc, I_Any } from "@/lib/types";

export const FRONTEND_PAGE_COLLECTIONS = {
    home: "page_home",
    contact: "page_contact",
    companyAbout: "page_company_about",
    companyIndustries: "page_company_industries",
    companyInsights: "page_company_insights",
    blogListing: "page_blog_listing",
    rentalOverview: "page_rental_overview",
    companyLocationDuesseldorf: "page_company_location_duesseldorf",
} as const;

type StaticPageKey = keyof typeof FRONTEND_PAGE_COLLECTIONS;
type AdminPageOption = {
    id: string;
    title: string;
    slug: string;
};

const STATIC_ADMIN_PAGE_OPTIONS: AdminPageOption[] = [
    { id: "page-1", title: "Startseite", slug: "/" },
    { id: "page-2", title: "Mietpark", slug: "/mieten" },
    { id: "page-3", title: "Über GÖTZ RENTAL", slug: "/unternehmen/ueber-uns" },
    { id: "page-4", title: "Kontakt", slug: "/kontakt" },
    { id: "page-company-industries", title: "Einsatz & Branchen", slug: "/unternehmen/branchen" },
    { id: "page-company-insights", title: "Insights", slug: "/unternehmen/insights" },
    { id: "page-blog-listing", title: "Blog & Ratgeber", slug: "/blog" },
    { id: "page-company-location-duesseldorf", title: "Standort Düsseldorf", slug: "/unternehmen/standorte/duesseldorf" },
];

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function normalizeUmlauts(value: string) {
    return value
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss");
}

export function normalizeCollectionSegment(value: string) {
    return normalizeUmlauts(value)
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function stripMongoId<T extends I_AdminDoc>(doc: T): T {
    if (!doc || typeof doc !== "object") return doc;
    const cloned = { ...doc };
    delete cloned._id;
    return cloned as T;
}

async function getPageCollection(name: string): Promise<Collection<I_AdminDoc>> {
    const db = await getDb();
    return db.collection<I_AdminDoc>(name);
}

async function ensureSingleDocumentCollection(name: string, factory: () => Promise<I_AdminDoc> | I_AdminDoc) {
    const collection = await getPageCollection(name);
    const existing = await collection.findOne({});

    if (existing) {
        return stripMongoId(existing);
    }

    const seed = stripMongoId(deepClone(await factory()));
    await collection.insertOne(seed);
    return seed;
}

export async function getSinglePageDocument(name: string, factory: () => Promise<I_AdminDoc> | I_AdminDoc) {
    const collection = await getPageCollection(name);
    const docs = await collection.find({}).limit(1).toArray();

    if (docs.length > 0) {
        return stripMongoId(docs[0]);
    }

    return ensureSingleDocumentCollection(name, factory);
}

const HOME_FAQS = [
    {
        question: "Wie funktioniert die Miete bei Götz Rental?",
        answer: "Die Miete ist ganz einfach: Wählen Sie Ihr gewünschtes Gerät aus, geben Sie den Mietzeitraum an und schließen Sie die Buchung ab. Wir liefern das Gerät pünktlich zu Ihrem Projekt und holen es nach der Mietdauer wieder ab."
    },
    {
        question: "Welche Arbeitshöhen bieten Sie an?",
        answer: "Unser Sortiment umfasst Arbeitsbühnen von 4m bis über 40m Arbeitshöhe. Von kompakten Scherenbühnen für Innenarbeiten bis zu großen Teleskopbühnen für Außeneinsätze – wir haben die passende Lösung für jede Anforderung."
    },
    {
        question: "Sind die Geräte versichert?",
        answer: "Ja, alle unsere Mietgeräte sind vollständig versichert. Zusätzlich bieten wir optionale Zusatzversicherungen an, um Sie bei Ihrem Projekt optimal abzusichern."
    },
    {
        question: "Bieten Sie auch Schulungen für die Bedienung an?",
        answer: "Selbstverständlich! Wir bieten umfassende Einweisungen und Schulungen für alle Gerätetypen an. Unsere erfahrenen Techniker zeigen Ihnen vor Ort die sichere und effiziente Bedienung."
    },
    {
        question: "Wie kurzfristig kann ich ein Gerät mieten?",
        answer: "Bei Verfügbarkeit können wir Geräte oft schon am nächsten Werktag liefern. Für eine garantierte Verfügbarkeit empfehlen wir eine Buchung 2-3 Tage im Voraus."
    },
    {
        question: "Welche Zahlungsmöglichkeiten gibt es?",
        answer: "Wir akzeptieren Überweisung, Lastschrift und für Geschäftskunden bieten wir auch Rechnungskauf mit individuellen Zahlungszielen an."
    },
    {
        question: "Ist eine Lieferung und Abholung im Preis enthalten?",
        answer: "Die Lieferung innerhalb unseres Standardgebiets ist im Mietpreis enthalten. Für weiter entfernte Standorte berechnen wir eine faire Transportpauschale, die wir Ihnen vorab transparent mitteilen."
    },
    {
        question: "Was passiert bei einem technischen Defekt während der Mietzeit?",
        answer: "Bei technischen Problemen steht Ihnen unser 24/7 Notdienst zur Verfügung. Wir tauschen defekte Geräte umgehend aus oder reparieren sie vor Ort, damit Ihr Projekt nicht ins Stocken gerät."
    },
    {
        question: "Benötige ich einen speziellen Führerschein?",
        answer: "Für die meisten Arbeitsbühnen ist kein spezieller Führerschein erforderlich, jedoch eine Einweisung und ggf. ein Befähigungsnachweis. Für LKW-Bühnen und größere Stapler gelten besondere Anforderungen – wir beraten Sie gerne."
    },
    {
        question: "Kann ich die Mietdauer verlängern?",
        answer: "Ja, eine Verlängerung ist nach Absprache jederzeit möglich. Kontaktieren Sie uns einfach vor Ablauf der ursprünglichen Mietzeit, und wir prüfen die Verfügbarkeit für eine nahtlose Verlängerung."
    }
];

const HOME_HEIGHT_RANGES = [
    { id: "60plus", label: "60+m", range: "60+m", mobileLabel: "60m+", title: "Giganten für extreme Höhen", desc: "Spezialgeräte für Windkraft und Industrie.", price: 950 },
    { id: "40-60", label: "40-60m", range: "40-60m", mobileLabel: "40-60m", title: "Maximaler Zugang", desc: "LKW-Bühnen und Super-Booms für Großprojekte.", price: 650 },
    { id: "30-40", label: "30-40m", range: "30-40m", mobileLabel: "30-40m", title: "Hocheffizient im Einsatz", desc: "Perfekt für Fassadenarbeiten an Hochhäusern.", price: 450 },
    { id: "28-30", label: "28-30m", range: "28-30m", mobileLabel: "28-30m", title: "Arbeitsbühnen bis 30m", desc: "Geeignet für größere Baustellen und anspruchsvolle Einsätze.", price: 250 },
    { id: "22-26", label: "22-26m", range: "22-26m", mobileLabel: "22-26m", title: "Vielseitige Mittelklasse", desc: "Ideal für Hallenbau und Wartungsarbeiten.", price: 200 },
    { id: "18-20", label: "18-20m", range: "18-20m", mobileLabel: "18-20m", title: "Standard für Gewerbe", desc: "Oft genutzt für Installationen und Reparaturen.", price: 152 },
    { id: "16", label: "16m", range: "16m", mobileLabel: "16m", title: "Kompakt & Wendig", desc: "Elektro-Scheren und Gelenksteiger für Innen.", price: 120 },
    { id: "14", label: "14m", range: "14m", mobileLabel: "14m", title: "Flexibel im Einsatz", desc: "Passt durch viele Standardtüren.", price: 110 },
    { id: "12", label: "12m", range: "12m", mobileLabel: "12m", title: "Der Allrounder", desc: "Unsere meistgemietete Klasse für Handwerker.", price: 95 },
    { id: "10", label: "10m", range: "10m", mobileLabel: "10m", title: "Einstiegsklasse", desc: "Sicherer Stand statt wackeliger Leiter.", price: 85 },
    { id: "6-8", label: "6-8m", range: "6-8m", mobileLabel: "6-8m", title: "Low-Level Access", desc: "Kompaktlifte für engste Räume.", price: 75 },
];

const HOME_HIGHLIGHTS = [
    {
        id: "all",
        title: "Alle Geräte",
        count: "22.000+",
        subtitle: "Unser Mietpark",
        image: "/Alle geräte.png",
        isSpecial: true,
        href: "/mieten",
    },
    {
        id: "scissors",
        title: "Scherenbühnen",
        subtitle: "Vertikal",
        price: "ab 120 €",
        image: "/Scherenbühne.png",
        href: "/mieten/geraet/mb-80-e",
    },
    {
        id: "telescope",
        title: "Teleskopbühnen",
        subtitle: "Reichweite",
        price: "ab 180 €",
        image: "/Teleskopbühne.png",
        href: "/mieten/geraet/tb-160",
    },
    {
        id: "articulated",
        title: "Gelenkteleskope",
        subtitle: "Flexibel",
        price: "ab 150 €",
        image: "/Gelenkteleskop.png",
        href: "/mieten/geraet/all",
    },
    {
        id: "mast",
        title: "Mastbühnen",
        subtitle: "Kompakt",
        price: "ab 95 €",
        image: "/Mastbühne.png",
        href: "/mieten/geraet/all",
    },
    {
        id: "forklift",
        title: "Gabelstapler",
        subtitle: "Lasten",
        price: "ab 95 €",
        image: "/Gabelstabler.png",
        href: "/mieten/geraet/gs-25",
    },
    {
        id: "roto",
        title: "Roto-Stapler",
        subtitle: "Multifunktional",
        price: "ab 350 €",
        image: "/Rotostabler.png",
        href: "/mieten/geraet/all",
    },
];

const INSIGHTS_POSTS = [
    {
        id: "arbeitssicherheit-2024",
        title: "Arbeitssicherheit auf Baustellen: Die wichtigsten Regeln 2024",
        excerpt: "Erfahren Sie, welche Sicherheitsvorschriften beim Einsatz von Arbeitsbühnen unbedingt beachtet werden müssen.",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800",
        category: "Sicherheit",
        date: "15. Januar 2024",
        readTime: "5 min"
    },
    {
        id: "richtige-arbeitsbuehne",
        title: "Die richtige Arbeitsbühne für Ihr Projekt wählen",
        excerpt: "Schere, Teleskop oder Gelenkbühne? Wir zeigen Ihnen, welche Bühne für welchen Einsatz am besten geeignet ist.",
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800",
        category: "Ratgeber",
        date: "10. Januar 2024",
        readTime: "7 min"
    },
    {
        id: "wartung-pflege",
        title: "Wartung und Pflege von Baumaschinen",
        excerpt: "Regelmäßige Wartung verlängert die Lebensdauer und erhöht die Sicherheit. Unsere Experten-Tipps.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        category: "Wartung",
        date: "5. Januar 2024",
        readTime: "6 min"
    },
    {
        id: "elektro-trend-2024",
        title: "Elektro-Arbeitsbühnen: Der Trend zur Nachhaltigkeit",
        excerpt: "Warum immer mehr Unternehmen auf emissionsfreie Arbeitsbühnen setzen und welche Vorteile dies bietet.",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800",
        category: "News",
        date: "20. Dezember 2023",
        readTime: "4 min"
    },
    {
        id: "schulungen-system-card",
        title: "SYSTEM-CARD: Qualifizierte Schulungen für Ihre Mitarbeiter",
        excerpt: "Sicherheit durch Kompetenz. Alles was Sie über unsere zertifizierten Bedienerschulungen wissen müssen.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
        category: "Ratgeber",
        date: "12. Dezember 2023",
        readTime: "8 min"
    },
    {
        id: "winterfest-machen",
        title: "Baumaschinen winterfest machen: Checkliste für Profis",
        excerpt: "Frost und Kälte können teure Schäden an Maschinen verursachen. So bereiten Sie Ihren Mietpark vor.",
        image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=800",
        category: "Technik",
        date: "01. Dezember 2023",
        readTime: "6 min"
    }
];

const DUESSELDORF_PRODUCTS = [
    {
        id: "gtb-125",
        name: "GTB 125-E",
        image: "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=400",
        price: "117,00",
        workingHeight: "12,52 m",
        sideReach: "6,78 m",
        maxLoad: "227 kg",
        type: "Elektro"
    },
    {
        id: "gtb-280",
        name: "GTB 280-E",
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400",
        price: "250,00",
        workingHeight: "28 m",
        sideReach: "19 m",
        maxLoad: "280 kg",
        type: "Hybrid",
        badge: "Hybrid"
    },
    {
        id: "lk-160",
        name: "LK 160-H",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=400",
        price: "202,00",
        workingHeight: "16,15 m",
        sideReach: "11,5 m",
        maxLoad: "300 kg",
        type: "Hybrid"
    },
    {
        id: "mb-100",
        name: "MB 100-E",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400",
        price: "105,00",
        workingHeight: "10,10 m",
        sideReach: "3,38 m",
        maxLoad: "200 kg",
        type: "Elektro"
    },
    {
        id: "sb-140",
        name: "SB 140-D",
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400",
        price: "117,00",
        workingHeight: "14,3 m",
        sideReach: "-",
        maxLoad: "363 kg",
        type: "Diesel"
    },
    {
        id: "sb-280",
        name: "SB 280m-E",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=400",
        price: "313,00",
        workingHeight: "28 m",
        sideReach: "-",
        maxLoad: "1000 kg",
        type: "Elektro",
        badge: "Megadeck"
    }
];

const STATIC_PAGE_SEEDS: Record<StaticPageKey, I_AdminDoc> = {
    home: {
        id: "page-home",
        route: "/",
        slug: "/",
        status: "published",
        seo: {
            title: "Götz Rental | Startseite",
            description: "Moderne Mietlösungen für Arbeitsbühnen, Stapler und Baumaschinen."
        },
        references: {
            pageId: "page-1",
        },
        hero: {
            slides: [
                {
                    id: 0,
                    title: "Industrielle Lösungen für höchste Präzision",
                    description: "Unsere Spezialgeräte für Lager und Industrie – kompakt, wendig und leistungsstark.",
                    image: "/GrünerSpiderListinIndustrielager.png",
                    cta: "Spezialgeräte entdecken",
                    color: "bg-brand-green",
                },
                {
                    id: 1,
                    title: "Effiziente Logistik mit modernster Technik",
                    description: "Leistungsstarke Stapler für Ihren Warenumschlag. Zuverlässig und einsatzbereit.",
                    image: "/StablerinIndustriehalle.png",
                    cta: "Stapler ansehen",
                    color: "bg-brand-dark",
                },
                {
                    id: 2,
                    title: "Ihre Experten für Arbeitsbühnen & Scherenbühnen",
                    description: "Qualität und Sicherheit für Ihre Projekte in luftiger Höhe. Entdecken Sie unsere moderne Flotte.",
                    image: "/Teleskopbühne&Scherenbühne.png",
                    cta: "Jetzt anfragen",
                    color: "bg-brand-teal",
                },
            ]
        },
        featureSection: {
            title: "Effiziente Mietlösungen für Ihr nächstes Projekt",
            description: "Ob Großbaustelle oder privates Projekt – wir bieten Ihnen die passende Technik zur richtigen Zeit. Profitieren Sie von unserer jahrzehntelangen Erfahrung und einem Maschinenpark, der keine Wünsche offen lässt.",
            bullets: [
                "Über 22.000 Mietgeräte sofort verfügbar",
                "Bundesweite Lieferung innerhalb von 24h",
                "Professionelle Einweisung durch Experten",
                "Flexible Mietdauern & faire Konditionen",
            ],
            ctaLabel: "Jetzt Gerät finden",
            image: "/Baustelle2.png",
            socialProof: {
                label: "Top Bewertung",
                quote: "Hervorragender Service und top gewartete Maschinen. Immer wieder gerne!"
            }
        },
        heightSelector: {
            title: "Wie hoch musst du arbeiten?",
            subtitle: "Wähle deine Arbeitshöhe und wir zeigen dir die passenden Geräte.",
            defaultSelectedId: "18-20",
            ranges: HOME_HEIGHT_RANGES,
            contactCard: {
                title: "Unsicher bei Einsatz oder Höhe?",
                description: "Wir prüfen Einsatz, Umfeld und Höhe gemeinsam. Gerne auch direkt bei dir vor Ort.",
                phone: "+49 721 123 456",
                email: "info@goetzrental.de",
                contactHref: "/kontakt",
                contactLabel: "Kontaktiere uns"
            }
        },
        faq: {
            title: "Häufig gestellte Fragen",
            subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Vermietung. Haben Sie weitere Fragen? Kontaktieren Sie uns gerne!",
            items: HOME_FAQS
        },
        highlightCarousel: {
            title: "Unsere Highlights",
            items: HOME_HIGHLIGHTS
        },
        updatedAt: new Date().toISOString(),
    },
    contact: {
        id: "page-contact",
        route: "/kontakt",
        slug: "/kontakt",
        status: "published",
        references: {
            pageId: "page-4",
        },
        hero: {
            title: "Kontakt aufnehmen",
            description: "Landshut, Regensburg, München, Hamburg oder Wien – wir sind per Chat oder Telefon direkt erreichbar."
        },
        chatSection: {
            badge: "24/7 Erreichbar",
            title: "Starte deine Anfrage direkt im Chat",
            description: "Du hast eine konkrete Frage zu Geräten, Verfügbarkeit oder Einsatzbedingungen? Unser Team und unser Chatbot antworten schnell und helfen dir bei der richtigen Lösung – direkt im Chat, ohne Wartezeit.",
            ctaLabel: "Jetzt Chat starten"
        },
        form: {
            eyebrow: "Oder nutze unser",
            title: "Kontaktformular für Angebots- und Projektanfragen",
            topics: ["Allgemeine Anfrage", "Mietanfrage", "Kaufanfrage", "Service & Wartung"]
        },
        addresses: [
            { title: "Götz Rental GmbH", lines: ["Hansestraße 45", "20095 Hamburg"] },
            { title: "Standort München", lines: ["Leopoldstraße 23", "80802 München"] },
            { title: "Standort Regensburg", lines: ["Landauer Str. 1", "93055 Regensburg"] },
        ],
        email: "info@goetzrental.de",
        phones: [
            { label: "Hamburg", value: "+49 40 123 456", href: "tel:+49600123456" },
            { label: "München", value: "+49 89 123 456", href: "tel:+49891234567" }
        ],
        featureHighlights: [
            { title: "24/7 Notfall Hotline", description: "Als Mieter unserer Geräte erreichst du uns rund um die Uhr unter: +49 40 123456." },
            { title: "Inklusive Anlieferung", description: "Wir liefern gemietete Arbeitsbühnen & Stapler direkt zu deinem Projekt – oder du holst direkt selbst ab." },
            { title: "Zugangskontrolle", description: "Vertraue auf unsere GÖTZ KEY CARD: nie wieder Fremdnutzung von Maschinen. Versprochen." },
            { title: "SYSTEM-CARD Schulungen", description: "Praxisnah, anerkannt, direkt bei uns – zertifizierte SYSTEM-CARD Schulungen." }
        ],
        map: {
            embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d155455.67954153725!2d11.458927807185072!3d48.154910609653775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75f9a38c5fd9%3A0x10cb84a7db1987d!2sM%C3%BCnchen!5e0!3m2!1sde!2sde!4v1706697486542!5m2!1sde!2sde",
            cards: [
                { label: "Hauptquartier", title: "Hamburg City" },
                { label: "Standort", title: "München Nord" }
            ]
        },
        floatingAction: {
            type: "phone"
        },
        updatedAt: new Date().toISOString(),
    },
    companyAbout: {
        id: "page-company-about",
        route: "/unternehmen/ueber-uns",
        slug: "/unternehmen/ueber-uns",
        status: "published",
        references: {
            pageId: "page-3",
        },
        heroSection: {
            title: "Götz Rental – Alles aus einer Hand",
            accent: "Alles aus einer Hand",
            paragraphs: [
                "Der Slogan „Alles aus einer Hand“ ist seit der Gründung Programm. Was mit der Vermietung von Baumaschinen begann, umfasst heute eine Flotte von mehr als 7.500 Mietgeräten, die europaweit im Einsatz sind.",
                "Von Arbeitsbühnen über Teleskopstapler bis hin zu Spezialkranen – durch unser vielseitiges Netzwerk und die Mitgliedschaft im Partnerverbund garantieren wir, dass Sie immer die passende Technik zur Verfügung haben."
            ],
            stats: [
                { value: "10+", label: "Standorte" },
                { value: "3000+", label: "Partner" }
            ],
            images: [
                { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", alt: "Team meeting" },
                { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", alt: "Management Team" }
            ]
        },
        certificationsSection: {
            title: "Zertifizierte Exzellenz",
            description: "Unsere Unternehmenspolitik basiert auf hohen Standards in den Bereichen Qualität, Arbeitssicherheit und Umweltschutz. Diese Zertifikate belegen unser Engagement für höchste Effizienz, Sicherheit und Nachhaltigkeit.",
            items: [
                {
                    title: "Qualitätsmanagement",
                    iso: "ISO 9001",
                    desc: "Unsere Qualitätspolitik basiert auf einer partnerschaftlichen und langfristigen Zusammenarbeit. Zertifiziert durch GUTcert."
                },
                {
                    title: "Arbeitsschutz",
                    iso: "ISO 45001",
                    desc: "Umfassende Vermeidung von Arbeitsunfällen und aktive Sensibilisierung der Belegschaft für Sicherheit."
                },
                {
                    title: "Energiemanagement",
                    iso: "ISO 50001",
                    desc: "Nachhaltiger Beitrag zum Umweltschutz. Steigerung der Energieeffizienz und Senkung der CO2-Emissionen."
                }
            ]
        },
        missionSection: {
            title: "Das sind wir – Götz Rental",
            accent: "Götz Rental",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000",
            imageAlt: "Construction Vision",
            imageBadge: "Unsere DNA",
            imageBadgeTitle: "Gemeinsam das Beste bauen.",
            paragraphs: [
                "Wir bieten unseren Kunden aus der Bauindustrie innovative Lösungen, um gemeinsam Projekte erfolgreich umzusetzen. Mit Götz Rental haben wir erfolgreiche Mietkonzepte entwickelt, die sämtliche Prozesse rund um das Thema Vermietung von Bautechnik optimieren und vereinfachen.",
                "Unter dem Dach der Götz Rental GmbH arbeiten mittlerweile über 80 Mitarbeiter daran, unseren Service, sowie unsere internen Abläufe immer weiter zu verbessern und die Anmietung für unsere Kunden noch leichter und schneller zu machen.",
                "Unser Ziel ist es, Ihnen von der ersten Beratung bis zur Rechnungsstellung einen umfassenden Service zu bieten – alles aus einer Hand. Wir verstehen uns nicht nur als Vermieter, sondern als Ihr Partner auf der Baustelle."
            ],
            values: [
                { title: "Einfachheit", description: "Unkomplizierte Mietprozesse und klare Kommunikation." },
                { title: "Verfügbarkeit", description: "Europaweites Netzwerk für maximale Flexibilität." }
            ]
        },
        historySection: {
            title: "Die Geschichte",
            subtitle: "Von 2014 bis heute – eine Erfolgsstory.",
            events: [
                { year: "2014", title: "Der Anfang", description: "Die Geschichte beginnt." },
                { year: "2017", title: "Übernahme", description: "Start von Götz Rental unter neuer Leitung." },
                { year: "2019", title: "Expansion", description: "Eröffnung des Standorts München und Erweiterung der Flotte." },
                { year: "2021", title: "Ausgründung", description: "Götz Rental wird ein eigenständiges Unternehmen." },
                { year: "2023", title: "Wachstum", description: "Starkes Umsatzwachstum und Verdopplung der Mitarbeiterzahl." },
                { year: "2024", title: "Team", description: "Mittlerweile über 80 Mitarbeiter an Bord." },
                { year: "Heute", title: "Alles aus einer Hand", description: "Über 7.500 Mietgeräte europaweit verfügbar." },
            ]
        },
        careerSection: {
            title: "Karriere bei Götz Rental",
            description: "Auf der Suche nach einer neuen Herausforderung? Wir wachsen weiter und suchen Talente, die mit uns hoch hinaus wollen.",
            ctaLabel: "Jetzt bewerben"
        },
        associationsSection: {
            title: "Mitwirkung in Verbänden",
            items: [
                "European Rental Association (ERA)",
                "Bundesverband der Baumaschinen-Firmen (bbi)",
                "Verband Garten-, Landschafts- und Sportplatzbau (VGL)",
                "Born to Lift e.V",
                "GDD e.V.",
                "VDBUM e.V.",
                "IPAF"
            ]
        },
        faq: {
            title: "Häufig gestellte Fragen",
            subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Vermietung. Haben Sie weitere Fragen? Kontaktieren Sie uns gerne!",
            items: HOME_FAQS
        },
        updatedAt: new Date().toISOString(),
    },
    companyIndustries: {
        id: "page-company-industries",
        route: "/unternehmen/branchen",
        slug: "/unternehmen/branchen",
        status: "published",
        hero: {
            badge: "Branchenlösungen",
            title: "Für jeden Einsatz das passende Gerät",
            description: "Jede Branche hat ihre eigenen Anforderungen. Wir kennen die Herausforderungen und bieten maßgeschneiderte Lösungen für Ihren Erfolg.",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
        },
        intro: {
            title: "Expertise über alle Branchen hinweg",
            description: "Ob in der Industriehalle, auf der Großbaustelle oder im unwegsamen Gelände – unsere Mietflotte ist so vielseitig wie Ihre Projekte. Entdecken Sie unsere spezialisierten Lösungen für Ihren Anwendungsbereich."
        },
        industries: [
            {
                id: "bau",
                title: "Bau & Handwerk",
                description: "Robuste Lösungen für Baustellen jeder Größe. Von der Rohbauphase bis zur Fassadengestaltung.",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
                color: "bg-orange-500"
            },
            {
                id: "industrie",
                title: "Industrie & Produktion",
                description: "Emissionsfreie Geräte für den Innenbereich und kompakte Lösungen für enge Gänge.",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
                color: "bg-blue-500"
            },
            {
                id: "logistik",
                title: "Logistik & Transport",
                description: "Effiziente Hebetechnik für Lagerhallen und Umschlagplätze. Maximieren Sie Ihre Lagerkapazitäten.",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
                color: "bg-brand-teal"
            },
            {
                id: "facility",
                title: "Facility Management",
                description: "Wartung und Instandhaltung leicht gemacht. Sicherer Zugang für Reinigungs- und Reparaturarbeiten.",
                image: "https://images.unsplash.com/photo-1581578731117-104f2a412c53?auto=format&fit=crop&q=80&w=800",
                color: "bg-yellow-500"
            },
            {
                id: "gala",
                title: "GaLaBau",
                description: "Geländegängige Bühnen für den Baumschnitt und Landschaftsbau. Schonend für den Untergrund.",
                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
                color: "bg-brand-teal"
            },
            {
                id: "events",
                title: "Events & Veranstaltungen",
                description: "Schwarze Bühnen für diskreten Aufbau und Technik für den Bühnenbau.",
                image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
                color: "bg-purple-500"
            }
        ],
        faq: {
            title: "Häufig gestellte Fragen",
            subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Vermietung. Haben Sie weitere Fragen? Kontaktieren Sie uns gerne!",
            items: HOME_FAQS
        },
        updatedAt: new Date().toISOString(),
    },
    companyInsights: {
        id: "page-company-insights",
        route: "/unternehmen/insights",
        slug: "/unternehmen/insights",
        status: "published",
        hero: {
            badge: "Wissen & News",
            title: "GÖTZ Insights",
            accent: "Insights",
            description: "Interessante Experten-Einblicke, aktuellste Branchennews und wertvolle Praxistipps rund um das Thema Arbeitsbühnen und Höhenzugangstechnik.",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000"
        },
        filters: {
            categories: ["Alle", "Sicherheit", "Ratgeber", "Wartung", "News", "Technik"]
        },
        featuredPosts: INSIGHTS_POSTS,
        updatedAt: new Date().toISOString(),
    },
    blogListing: {
        id: "page-blog-listing",
        route: "/blog",
        slug: "/blog",
        status: "published",
        hero: {
            title: "Aktuelles & Fachwissen",
            description: "Entdecken Sie unsere neuesten Beiträge zu Arbeitssicherheit, Gerätewahl und Branchen-News."
        },
        updatedAt: new Date().toISOString(),
    },
    rentalOverview: {
        id: "page-rental-overview",
        route: "/mieten",
        slug: "/mieten",
        status: "published",
        hero: {
            title: "Unser Mietpark",
            description: "Entdecken Sie unser gesamtes Sortiment an Hebebühnen, Staplern und Baumaschinen – für jeden Einsatz das passende Gerät."
        },
        updatedAt: new Date().toISOString(),
    },
    companyLocationDuesseldorf: {
        id: "page-company-location-duesseldorf",
        route: "/unternehmen/standorte/duesseldorf",
        slug: "/unternehmen/standorte/duesseldorf",
        status: "published",
        hero: {
            eyebrow: "Arbeitsbühnen am Standort Düsseldorf",
            title: "Du möchtest eine Arbeitsbühne in Düsseldorf mieten?",
            description: "Bei GÖTZ RENTAL in Düsseldorf mietest du flexibel und jederzeit verfügbare Modelle: ob für Bauvorhaben, Wartungsarbeiten oder Events – bei uns stehen dir verschiedene moderne und leistungsstarke Arbeitsbühnen zur Auswahl. Von Scheren- über Teleskop- bis hin zu Gelenkteleskopbühnen.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
            imageAlt: "Götz Rental Düsseldorf Standort"
        },
        contact: {
            addressTitle: "GÖTZ RENTAL Arbeitsbühnen und Stapler",
            addressLines: ["Musterstraße 123", "D-40210 Düsseldorf"],
            email: "duesseldorf@goetz-rental.de",
            phone: "+49 211 1234567"
        },
        featuredProducts: DUESSELDORF_PRODUCTS,
        whyBook: {
            title: "Arbeitsbühnen mieten in Düsseldorf – Flexibel, Sicher, Zuverlässig",
            paragraphs: [
                "Sie suchen eine Arbeitsbühne zur Miete in Düsseldorf? Bei GÖTZ RENTAL profitieren Sie von einer modernen Mietflotte, die höchste Sicherheitsstandards erfüllt und für jeden Einsatzbereich die passende Lösung bietet.",
                "Ob Scherenbühne für Innenarbeiten, Teleskopbühne für große Höhen oder Gelenkteleskopbühne für schwer zugängliche Bereiche – unsere Arbeitsbühnen sind sofort verfügbar und werden direkt zu Ihrer Baustelle in Düsseldorf und Umgebung geliefert."
            ],
            stats: [
                { value: "24/7", label: "Notfall-Hotline für Mieter" },
                { value: "100%", label: "Geprüfte Sicherheit" },
                { value: "48h", label: "Express-Lieferung möglich" },
                { value: "500+", label: "Geräte am Standort" }
            ],
            image: "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=1000"
        },
        processSection: {
            title: "So einfach mieten Sie bei uns – In 4 Schritten zur Arbeitsbühne",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
            steps: [
                { title: "Anfrage stellen", description: "Kontaktieren Sie uns telefonisch, per E-Mail oder über unser Kontaktformular. Teilen Sie uns Ihre Anforderungen mit – wir beraten Sie gerne." },
                { title: "Beratung & Angebot", description: "Unsere Experten empfehlen Ihnen die passende Arbeitsbühne für Ihr Projekt und erstellen ein individuelles Angebot – transparent und fair." },
                { title: "Lieferung & Einweisung", description: "Wir liefern die Arbeitsbühne pünktlich zu Ihrem Wunschtermin und weisen Ihr Team vor Ort in die sichere Bedienung ein." },
                { title: "Abholung & Abrechnung", description: "Nach Projektende holen wir die Arbeitsbühne wieder ab. Sie erhalten eine transparente Abrechnung – ohne versteckte Kosten." }
            ]
        },
        featureCards: [
            { title: "24/7 Notfall Hotline", description: "Als Mieter unserer Geräte erreichst du uns rund um die Uhr unter: +49 211 1234567." },
            { title: "Inklusive Anlieferung", description: "Wir liefern gemietete Arbeitsbühnen & Stapler direkt zu deinem Projekt - oder du holst direkt selbst ab." },
            { title: "Zugangskontrolle", description: "Vertraue auf unsere GÖTZ KEY CARD: nie wieder Fremdnutzung von Maschinen. Versprochen." },
            { title: "SYSTEM-CARD Schulungen", description: "Praxisnah, anerkannt, direkt bei uns – zertifizierte SYSTEM-CARD Schulungen für Arbeitsbühnen & Stapler buchen." }
        ],
        updatedAt: new Date().toISOString(),
    }
};

async function getStaticSeedByCollection(name: string) {
    const entry = Object.entries(FRONTEND_PAGE_COLLECTIONS).find(([, collection]) => collection === name);
    if (!entry) {
        throw new Error(`Unknown static page collection: ${name}`);
    }
    const [key] = entry as [StaticPageKey, string];
    return deepClone(STATIC_PAGE_SEEDS[key]);
}

export async function getStaticPageDocument(collectionName: string) {
    return getSinglePageDocument(collectionName, () => getStaticSeedByCollection(collectionName));
}

async function listProducts() {
    return listSeededCollection(COLLECTIONS.products, "products", mockProducts);
}

async function listCategories() {
    return listSeededCollection(COLLECTIONS.categories, "categories");
}

async function listBlogPosts() {
    return listSeededCollection(COLLECTIONS.blog, "blog");
}

async function listLocations() {
    return listSeededCollection(COLLECTIONS.locations, "locations", []);
}

export async function getAdminPageOptions() {
    const [legacyPages, locations] = await Promise.all([
        listSeededCollection(COLLECTIONS.pages, "pages", []),
        listLocations(),
    ]);

    const options = new Map<string, AdminPageOption>();

    [...STATIC_ADMIN_PAGE_OPTIONS, ...legacyPages.map((page: I_Any) => ({
        id: page.id,
        title: page.title || page.name || page.slug || page.id,
        slug: page.slug || "/",
    }))].forEach((page) => {
        if (!page?.id || !page?.title) return;
        options.set(page.id, page);
    });

    locations
        .filter((location: I_Any) => location?.id && location?.name)
        .forEach((location: I_Any) => {
            options.set(location.id, {
                id: location.id,
                title: location.name,
                slug: `/standorte/${normalizeUmlauts(location.name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
            });
        });

    return Array.from(options.values()).sort((a, b) => a.title.localeCompare(b.title, "de"));
}

function buildGenericLocationSeed(location: I_Any, slug: string) {
    return {
        id: `page-location-${slug}`,
        route: `/standorte/${slug}`,
        slug,
        status: "published",
        hero: {
            eyebrow: `Arbeitsbühnen am Standort ${location.name}`,
            title: `Du möchtest eine Arbeitsbühne in ${location.name} mieten?`,
            description: `Bei GÖTZ RENTAL in ${location.name} mietest du flexibel und jederzeit verfügbare Modelle: ob für Bauvorhaben, Wartungsarbeiten oder Events.`,
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000"
        },
        contact: {
            addressTitle: "GÖTZ RENTAL Arbeitsbühnen und Stapler",
            addressLines: ["Musterstraße 123", `D-40210 ${location.name}`],
            email: `${normalizeUmlauts(location.name).replace(/[^a-z0-9]+/g, "")}@goetz-rental.de`,
            phone: "+49 211 1234567"
        },
        sections: {
            intro: {
                title: `Arbeitsbühnen & Mietgeräte in ${location.name} – flexibel, sicher und zuverlässig`,
                bullets: [
                    "Moderne und geprüfte Mietgeräte",
                    "Flexible Mietzeiträume – stunden-, tage- oder wochenweise",
                    "Persönliche Beratung durch erfahrene Ansprechpartner",
                    `Schnelle Verfügbarkeit direkt in ${location.name}`
                ]
            },
            useCases: [
                "Bau- und Sanierungsarbeiten",
                "Montage- und Wartungseinsätze",
                "Industrie- und Hallenarbeiten",
                "Events, Messen und temporäre Installationen"
            ]
        },
        faq: {
            title: `Häufige Fragen zur Geräte- & Arbeitsbühnenmiete in ${location.name}`,
            items: [
                {
                    question: "Welche Mietdauer ist möglich?",
                    answer: "Unsere Geräte können flexibel gemietet werden – von kurzen Einsätzen bis hin zu langfristigen Projekten."
                },
                {
                    question: `Welche Geräte sind in ${location.name} verfügbar?`,
                    answer: "Die Verfügbarkeit richtet sich nach Standort und Zeitraum. Im Konfigurator sehen Sie direkt, welche Geräte aktuell verfügbar sind."
                },
                {
                    question: "Gibt es eine Einweisung oder Schulung?",
                    answer: "Auf Wunsch erhalten Sie eine Einweisung in die Bedienung der Geräte oder zusätzliche Serviceleistungen."
                },
                {
                    question: "Wie schnell kann ein Gerät bereitgestellt werden?",
                    answer: "In vielen Fällen ist eine kurzfristige Bereitstellung möglich – besonders bei regionaler Verfügbarkeit."
                }
            ]
        },
        references: {
            locationId: location.id,
            productIds: location.productIds || []
        },
        updatedAt: new Date().toISOString(),
    };
}

export function getLocationCollectionName(slug: string) {
    return `page_location_${normalizeCollectionSegment(slug)}`;
}

export async function getLocationPageDocument(slug: string) {
    const collectionName = getLocationCollectionName(slug);
    const locations = await listLocations();
    const normalizedSlug = normalizeUmlauts(decodeURIComponent(slug));
    const location = locations.find((loc: I_Any) =>
        loc?.name && normalizeCollectionSegment(loc.name) === normalizeCollectionSegment(normalizedSlug)
    );

    if (!location || location.status !== "published") {
        return null;
    }

    return getSinglePageDocument(collectionName, () => buildGenericLocationSeed(location, normalizeCollectionSegment(normalizedSlug)));
}

const VIRTUAL_CATEGORIES: Record<string, string[]> = {
    arbeitsbuehnen: ["Teleskopbühnen", "Scherenbühnen", "Gelenkteleskope", "Mastbühnen", "LKW-Bühnen", "Anhängerbühne", "Raupenbühnen", "Vertikalmastbüh", "Vertikalmastbühne"],
    stapler: ["Gabelstapler", "Geländestapler", "Telestapler", "Rotostapler", "Roto-Stapler"],
    baumaschinen: ["Minibagger", "Radlader", "Dumper", "Baumaschinen"],
};

function getVirtualCategoryKey(value: string) {
    const normalized = normalizeUmlauts(value);
    if (normalized.includes("buehne") || VIRTUAL_CATEGORIES.arbeitsbuehnen.some((entry) => normalizeUmlauts(entry).includes(normalized))) return "arbeitsbuehnen";
    if (normalized.includes("stapler") || normalized.includes("hubwagen") || VIRTUAL_CATEGORIES.stapler.some((entry) => normalizeUmlauts(entry).includes(normalized))) return "stapler";
    if (normalized.includes("bagger") || normalized.includes("lader") || normalized.includes("baumaschine") || VIRTUAL_CATEGORIES.baumaschinen.some((entry) => normalizeUmlauts(entry).includes(normalized))) return "baumaschinen";
    return null;
}

export function getRentalCategoryCollectionName(slug: string) {
    return `page_rental_category_${normalizeCollectionSegment(slug)}`;
}

export async function getRentalCategoryPageDocument(slug: string) {
    const categories = await listCategories();
    const decodedSlug = decodeURIComponent(slug).toLowerCase();
    const normalizedSlug = normalizeUmlauts(decodedSlug);

    const foundCategory = categories.find((category: I_Any) =>
        normalizeUmlauts(category.name) === normalizedSlug ||
        (category.link && normalizeUmlauts(category.link).endsWith(normalizedSlug))
    );
    const virtualKey = foundCategory ? null : (VIRTUAL_CATEGORIES[normalizedSlug] ? normalizedSlug : getVirtualCategoryKey(normalizedSlug));

    if (!foundCategory && !virtualKey) {
        return null;
    }

    return getSinglePageDocument(getRentalCategoryCollectionName(slug), async () => {
        const meta = {
            title: "",
            description: "",
            subcategories: [] as I_Any[],
        };

        if (foundCategory) {
            meta.title = foundCategory.name;
            meta.description = foundCategory.description || `Mieten Sie ${foundCategory.name} bei uns.`;

            const subcategories = categories.filter((category: I_Any) => category.parentCategory === foundCategory.id);
            meta.subcategories = subcategories.map((subcategory: I_Any) => ({
                name: subcategory.name,
                image: subcategory.image,
                link: subcategory.link,
            }));
        } else if (virtualKey) {
            meta.title = virtualKey === "arbeitsbuehnen"
                ? "Arbeitsbühne mieten"
                : virtualKey === "stapler"
                    ? "Stapler mieten"
                    : "Baumaschinen mieten";
            meta.description = virtualKey === "arbeitsbuehnen"
                ? "Über 170 geprüfte Modelle – sicher, flexibel und sofort verfügbar für jeden Einsatz"
                : virtualKey === "stapler"
                    ? "Leistungsstarke Gabelstapler und Teleskoplader für jede Hubhöhe und Tragkraft"
                    : "Robuste Bagger, Radlader und mehr für Ihre Baustelle";
            meta.subcategories = categories
                .filter((category: I_Any) => VIRTUAL_CATEGORIES[virtualKey].some((name) => normalizeUmlauts(name) === normalizeUmlauts(category.name)))
                .map((category: I_Any) => ({
                    name: category.name,
                    image: category.image,
                    link: category.link,
                }));
        }

        return {
            id: `page-rental-category-${normalizeCollectionSegment(slug)}`,
            route: `/mieten/${slug}`,
            slug,
            status: "published",
            meta,
            updatedAt: new Date().toISOString(),
        };
    });
}

export function getProductCollectionName(id: string) {
    return `page_product_${normalizeCollectionSegment(id)}`;
}

export async function getProductPageDocument(id: string) {
    const products = await listProducts();
    const product = products.find((item: I_Any) => item.id === id);

    if (!product) {
        return null;
    }

    return getSinglePageDocument(getProductCollectionName(id), () => ({
        id: `page-product-${normalizeCollectionSegment(id)}`,
        route: `/mieten/geraet/${id}`,
        slug: id,
        status: "published",
        seo: {
            title: `${product.name} mieten`,
            description: product.description || product.shortDescription || `Produktdetails und Alternativen für ${product.name}.`
        },
        references: {
            productId: product.id,
            alternativeLimit: 6
        },
        updatedAt: new Date().toISOString(),
    }));
}

export function getBlogPostCollectionName(id: string) {
    return `page_blog_post_${normalizeCollectionSegment(id)}`;
}

export async function getBlogPostPageDocument(id: string) {
    const posts = await listBlogPosts();
    const post = posts.find((entry: I_Any) => entry.id === id);

    if (!post) {
        return null;
    }

    return getSinglePageDocument(getBlogPostCollectionName(id), () => ({
        id: `page-blog-post-${normalizeCollectionSegment(id)}`,
        route: `/blog/${id}`,
        slug: id,
        status: post.status || "published",
        title: post.title,
        excerpt: post.excerpt,
        image: post.image,
        category: post.category,
        categories: post.categories || [],
        date: post.date,
        readTime: post.readTime,
        content: post.content || "",
        references: {
            blogId: post.id
        },
        updatedAt: new Date().toISOString(),
    }));
}

export async function getFrontendPageDocument(type: string) {
    if (Object.values(FRONTEND_PAGE_COLLECTIONS).includes(type as I_Any)) {
        return getStaticPageDocument(type);
    }

    return null;
}
