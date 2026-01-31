export type Product = {
    id: string;
    name: string;
    category: "Arbeitsbühnen" | "Stapler" | "Baumaschinen" | "Gerüste";
    subcategory: string;
    image: string;
    description?: string;
    details: {
        height?: string; // Arbeitshöhe
        reach?: string; // Reichweite
        load?: string; // Tragkraft
        power?: "Diesel" | "Elektro" | "Hybrid";
        weight?: string;
        transportWidth?: string;
        transportHeight?: string;
    };
    fullSpecs?: Record<string, string>;
    price: number; // Daily rate
    alternatives?: {
        smaller?: { id: string; name: string; height: string; image: string };
        larger?: { id: string; name: string; height: string; image: string };
    };
    insuranceText?: string;
};

export const products: Product[] = [
    {
        id: "mb-80-e",
        name: "MB 80-E",
        category: "Arbeitsbühnen",
        subcategory: "Vertikalmastbühne Elektrisch",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
        description: "Wenn neben kleiner Höhe auch seitliche Reichweite gefragt ist, spielt die MB 80-E Vertikalmastbühne ihre Stärke aus. Mit einer Arbeitshöhe von 8,20 Metern und einem integrierten Ausleger eignet sie sich ideal für präzise Arbeiten an Decken, Wänden oder über Hindernisse hinweg.",
        details: {
            height: "8,20 m",
            reach: "2,65 m",
            load: "200 kg",
            power: "Elektro",
            weight: "1,86 t",
            transportWidth: "0,99 m",
            transportHeight: "1,99 m"
        },
        fullSpecs: {
            "Arbeitshöhe": "8,20 m",
            "Plattformhöhe": "6,20 m",
            "Plattformgröße": "85 x 92 cm",
            "Einsatzort": "Innen / Außen",
            "Bodenfreiheit": "10 cm",
            "Eigengewicht": "1,86 t",
            "Transporthöhe": "1,99 m",
            "Reichweite": "2,65 m",
            "Drehbarer Korb": "Ja",
            "Motor": "Elektro",
            "Fahrgeschwindigkeit": "5,5 km/h",
            "Radstand": "1,20 m",
            "Transportlänge": "2,10 m",
            "Höhe Gelenkknick": "5,08 m",
            "Korblast": "200 kg",
            "Bereifung": "nicht markierend",
            "Steigfähigkeit": "25 %",
            "Wenderadius": "0,55 m",
            "Transportbreite": "0,99 m"
        },
        price: 105,
        alternatives: {
            smaller: {
                id: "mb-60",
                name: "Kleiner",
                height: "5,66 m Arbeitshöhe",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=200"
            },
            larger: {
                id: "mb-100",
                name: "Größer",
                height: "10,10 m Arbeitshöhe",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=200"
            }
        },
        insuranceText: "Unsere Maschinenbruchversicherung schützt Sie vor unvorhersehbaren Schäden am Gerät. Die Selbstbeteiligung beträgt im Schadensfall 500 €."
    },
    {
        id: "tb-160",
        name: "Teleskopbühne T 160",
        category: "Arbeitsbühnen",
        subcategory: "Teleskop",
        image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=600",
        details: { height: "16.00 m", reach: "10.00 m", load: "250 kg", power: "Diesel" },
        price: 180,
    },
    {
        id: "s-120-el",
        name: "Scherenbühne S 120 EL",
        category: "Arbeitsbühnen",
        subcategory: "Schere",
        image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600",
        details: { height: "12.00 m", load: "450 kg", power: "Elektro" },
        price: 120,
    },
    {
        id: "gs-25",
        name: "Gabelstapler GS 25",
        category: "Stapler",
        subcategory: "Frontstapler",
        image: "https://images.unsplash.com/photo-1589717013858-29b14db8355b?auto=format&fit=crop&q=80&w=600",
        details: { load: "2500 kg", height: "4.50 m", power: "Diesel" },
        price: 150,
    },
    {
        id: "rt-40",
        name: "Roto-Teleskopstapler R 40",
        category: "Stapler",
        subcategory: "Roto",
        image: "https://images.unsplash.com/photo-1518385888806-38d2239f6044?auto=format&fit=crop&q=80&w=600",
        details: { height: "21.00 m", reach: "18.00 m", load: "4000 kg", power: "Diesel" },
        price: 350,
    },
    {
        id: "mb-100",
        name: "Mastbühne MB 100",
        category: "Arbeitsbühnen",
        subcategory: "Mast",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
        details: { height: "10.00 m", reach: "3.00 m", load: "200 kg", power: "Elektro" },
        price: 95
    },
    {
        id: "exc-50",
        name: "Minibagger MB 50",
        category: "Baumaschinen",
        subcategory: "Bagger",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
        details: { load: "5000 kg", power: "Diesel" },
        price: 220,
    },
];
