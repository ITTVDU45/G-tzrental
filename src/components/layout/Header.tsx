"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Phone, Mail, Clock, ArrowRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
    title: string;
    icon: string;
    description: string;
    link: string;
    highlight?: boolean;
    submenu?: { name: string; link: string }[];
};

type AdminPageLocation = {
    id?: string;
    status?: string;
    name?: string;
    slug?: string;
};

type MenuProduct = {
    id?: string;
    name?: string;
    image?: string;
    showInMenu?: boolean;
};

function normalizeLocationSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
}

function mapPublishedLocations(data: AdminPageLocation[]) {
    return data
        .filter((loc) => loc && loc.status === 'published' && loc.name)
        .map((loc) => {
            const name = loc.name ?? "";
            return {
                name,
                slug: normalizeLocationSlug(name),
            };
        });
}

const LiftIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Base / Chassis */}
        <rect x="3" y="16" width="10" height="3" rx="1" fill="currentColor" fillOpacity="0.1" />
        <circle cx="5.5" cy="20" r="1.5" />
        <circle cx="10.5" cy="20" r="1.5" />

        {/* Arm / Boom */}
        <path d="M8 16L14 8" />
        <path d="M12 10.5L18 4" />

        {/* Basket / Platform */}
        <rect x="16" y="2" width="6" height="4" rx="1" strokeWidth="2" />
        <path d="M16 4H22" />
    </svg>
);

const navItems = [
    {
        name: "Mieten",
        href: "/mieten",
        megaMenu: true,
    },
    {
        name: "Standorte",
        href: "/standorte",
        enhancedDropdown: true,
    },
    {
        name: "Service",
        href: "/service",
        enhancedDropdown: true,
    },
    {
        name: "Unternehmen",
        href: "/unternehmen",
        enhancedDropdown: true,
    },
    {
        name: "Kontakt",
        href: "/kontakt",
    },
];

const megaMenuCategories = [
    {
        title: "Arbeitsbühnen",
        items: [
            "Teleskopbühnen",
            "Gelenkteleskopbühnen",
            "Scherenbühnen",
            "Mastbühnen",
            "Raupenbühnen",
            "LKW-Arbeitsbühnen",
            "Anhängerbühnen"
        ]
    },
    {
        title: "Stapler",
        items: [
            "Teleskopstapler",
            "Frontstapler",
            "Geländestapler",
            "Schubmaststapler",
            "Hochhubwagen"
        ]
    },
    {
        title: "Baumaschinen",
        items: [
            "Minibagger",
            "Kompaktlader",
            "Radlader",
            "Dumper",
            "Rüttelplatten"
        ]
    },
    {
        title: "Weitere Kategorien",
        items: [
            "Elektrische Arbeitsbühnen",
            "Diesel-Arbeitsbühnen",
            "Gelände-Arbeitsbühnen",
            "Hybrid-Arbeitsbühnen",
            "Kompakt- & Mini-Arbeitsbühnen"
        ]
    }
];

const featuredProducts = [
    {
        title: "MB 80-E mieten",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400",
        link: "/mieten/geraet/mb-80-e"
    },
    {
        title: "Stapler mieten",
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400",
        link: "/mieten/geraet/gs-25"
    }
];

const serviceMenuItems: MenuItem[] = [
    {
        title: "Arbeitsbühnenvermietung",
        icon: "🏗️",
        description: "Professionelle Vermietung aller Arbeitsbühnentypen",
        link: "/service/arbeitsbuehnen"
    },
    {
        title: "Staplervermietung",
        icon: "🚜",
        description: "Teleskopstapler und mehr für Ihre Projekte",
        link: "/service/stapler"
    },
    {
        title: "24/7-Notdienst-Hotline",
        icon: "📞",
        description: "Rund um die Uhr für Sie erreichbar",
        link: "/service/notdienst",
        highlight: true
    },
    {
        title: "Baustellenbesichtigung",
        icon: "👁️",
        description: "Kostenlose Beratung vor Ort",
        link: "/service/besichtigung"
    },
    {
        title: "Bedienpersonal",
        icon: "👷",
        description: "Qualifizierte Fachkräfte auf Anfrage",
        link: "/service/personal"
    },
    {
        title: "Ersatzteileservice",
        icon: "⚙️",
        description: "Original-Ersatzteile schnell verfügbar",
        link: "/service/ersatzteile"
    },
    {
        title: "Fehlercode-Finder",
        icon: "🔍",
        description: "Schnelle Diagnose und Problemlösung",
        link: "/service/fehlercode"
    },
    {
        title: "Schulungen",
        icon: "🎓",
        description: "Zertifizierte Bedienerschulungen",
        link: "/service/schulungen"
    },
    {
        title: "Inspektion & Wartung",
        icon: "🔧",
        description: "Regelmäßige Wartung für maximale Sicherheit",
        link: "/service/wartung"
    },
    {
        title: "Reparatur & Service",
        icon: "🛠️",
        description: "Schnelle Reparaturen durch Experten",
        link: "/service/reparatur"
    },
    {
        title: "UVV-Prüfungen",
        icon: "✅",
        description: "Gesetzlich vorgeschriebene Sicherheitsprüfungen",
        link: "/service/uvv"
    }
];

const companyMenuItems: MenuItem[] = [
    {
        title: "Anfahrt",
        icon: "🚗",
        description: "So finden Sie uns",
        link: "/unternehmen/anfahrt"
    },
    {
        title: "Ansprechpartner",
        icon: "👥",
        description: "Ihr direkter Kontakt zu uns",
        link: "/unternehmen/ansprechpartner"
    },
    {
        title: "Einsatz & Branchen",
        icon: "🏭",
        description: "Unsere Expertise in verschiedenen Bereichen",
        link: "/unternehmen/branchen"
    },
    {
        title: "Insights",
        icon: "💡",
        description: "Neuigkeiten und Einblicke",
        link: "/unternehmen/insights"
    },
    {
        title: "Über GÖTZ RENTAL",
        icon: "ℹ️",
        description: "Unsere Geschichte und Werte",
        link: "/unternehmen/ueber-uns",
        highlight: true
    },

];

const topBarItems = [
    {
        icon: Clock,
        label: "Öffnungszeiten",
        content: "Mo-Fr 7:00-18:00 Uhr, Sa 8:00-14:00 Uhr",
        href: "/kontakt",
    },
    {
        icon: Mail,
        label: "E-Mail",
        content: "info@goetzrental.de",
        href: "mailto:info@goetzrental.de",
    },
    {
        icon: Phone,
        label: "Telefon",
        content: "+49 (0) 123 456 789-00",
        href: "tel:+4912345678900",
    },
] as const;

const socialItems = [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
] as const;

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [locations, setLocations] = useState<{ name: string; slug: string }[]>([]);
    const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([]);

    const loadLocations = async () => {
        try {
            const res = await fetch('/api/admin/locations', { cache: 'no-store' });
            const data = await res.json();
            if (!Array.isArray(data)) {
                setLocations([]);
                return;
            }
            setLocations(mapPublishedLocations(data as AdminPageLocation[]));
        } catch (err) {
            console.error('Error fetching locations:', err);
        }
    };

    useEffect(() => {
        const fetchMenuProducts = async () => {
            try {
                const res = await fetch('/api/admin/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const shownProducts = (data as MenuProduct[]).filter((p) => p.showInMenu).slice(0, 4);
                    setMenuProducts(shownProducts);
                }
            } catch (err) {
                console.error('Error fetching menu products:', err);
            }
        };
        fetchMenuProducts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initializeLocations = async () => {
            try {
                const res = await fetch('/api/admin/locations', { cache: 'no-store' });
                const data = await res.json();
                if (!isMounted) return;

                if (!Array.isArray(data)) {
                    setLocations([]);
                    return;
                }

                setLocations(mapPublishedLocations(data as AdminPageLocation[]));
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        };

        void initializeLocations();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "fixed top-4 left-4 right-4 z-50 transition-all duration-500",
                isScrolled ? "top-2" : "top-4"
            )}
        >
            <div className="mx-auto w-full max-w-[1920px]">
                <motion.div
                    layout
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className={cn(
                        "overflow-visible rounded-[2rem] transition-all duration-500 border",
                        isScrolled
                            ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl border-zinc-200/60 dark:border-zinc-800/60"
                            : "bg-white dark:bg-zinc-900 shadow-xl border-zinc-100 dark:border-zinc-800"
                    )}
                >
                    <AnimatePresence initial={false}>
                        {!isScrolled && (
                            <motion.div
                                key="desktop-topbar"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="hidden overflow-hidden border-b border-zinc-100/80 bg-zinc-50/80 text-sm dark:border-zinc-800/80 dark:bg-zinc-950/40 lg:block"
                            >
                                <div className="flex items-center justify-between gap-6 px-8 py-3">
                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                                        {topBarItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    className="flex min-w-0 items-center gap-3 text-zinc-600 transition-colors hover:text-brand-teal dark:text-zinc-300 dark:hover:text-brand-teal"
                                                >
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-teal shadow-sm dark:bg-zinc-900">
                                                        <Icon className="h-4 w-4" />
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                                                            {item.label}
                                                        </span>
                                                        <span className="block truncate font-semibold text-zinc-700 dark:text-zinc-200">
                                                            {item.content}
                                                        </span>
                                                    </span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {socialItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={item.label}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-brand-teal dark:bg-zinc-900 dark:text-zinc-300"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        layout
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="px-6 md:px-8"
                        animate={{ paddingTop: isScrolled ? 10 : 16, paddingBottom: isScrolled ? 10 : 16 }}
                    >
                        <motion.div
                            layout
                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            className="flex items-center justify-between gap-6"
                        >
                            {/* Logo */}
                            <Link href="/" className="z-50 shrink-0">
                                <motion.div
                                    layout
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                    animate={{
                                        width: isScrolled ? 208 : 288,
                                        height: isScrolled ? 48 : 72,
                                    }}
                                    className="relative"
                                >
                                    <Image
                                        src="/GötzRental2.png"
                                        alt="GötzRental Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </Link>

                            {/* Desktop Navigation */}
                            <motion.nav
                                layout
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
                                animate={{ gap: isScrolled ? 6 : 8 }}
                            >
                                {navItems.map((item, index) => (
                                    <motion.div
                                        layout
                                        key={item.name}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.1,
                                            duration: 0.35,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                        className={cn("group", !item.megaMenu && "relative")}
                                        onMouseEnter={() => {
                                            if (item.name === "Standorte") {
                                                void loadLocations();
                                            }
                                            setActiveDropdown(item.name);
                                        }}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        <motion.div
                                            layout
                                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-1 font-semibold text-zinc-700 transition-colors hover:text-brand-teal dark:text-zinc-300 dark:hover:text-brand-teal rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                                                isScrolled
                                                    ? "px-3 py-2 text-[13px]"
                                                    : "px-4 py-2.5 text-sm"
                                            )}
                                        >
                                            {item.name}
                                            {(item.megaMenu || item.enhancedDropdown) && (
                                                <ChevronDown className={cn(
                                                    "w-4 h-4 transition-transform duration-300",
                                                    activeDropdown === item.name && "rotate-180"
                                                )} />
                                            )}
                                        </Link>
                                        </motion.div>

                                        <AnimatePresence>
                                            {activeDropdown === item.name && item.megaMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 15 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                                                >
                                                    <div className="p-10">
                                                        <div className="mb-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                                            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Scherenbühnen Mieten</h3>
                                                            <Link href="/mieten" className="text-sm font-bold text-brand-teal hover:underline flex items-center gap-1">
                                                                Alle anzeigen <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-6">
                                                            {menuProducts.map((product, prodIndex) => (
                                                                <motion.div
                                                                    key={product.id || prodIndex}
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: prodIndex * 0.05 }}
                                                                >
                                                                    <Link
                                                                        href={`/mieten/geraet/${product.id}`}
                                                                        className="group block relative h-[180px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800"
                                                                    >
                                                                        <Image
                                                                            src={product.image || "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=400"}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                                                            <h4 className="text-white text-base font-bold flex flex-col gap-1">
                                                                                <span className="leading-tight">{product.name}</span>
                                                                                <span className="text-xs text-zinc-300 font-medium flex items-center gap-1 mt-1">
                                                                                    Mieten <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                                                </span>
                                                                            </h4>
                                                                        </div>
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                            {menuProducts.length === 0 && (
                                                                <div className="col-span-4 py-8 text-center text-zinc-500 font-medium">Keine Produkte für das Menü ausgewählt. Bitte im Admin-Bereich aktivieren.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Enhanced Dropdown for Service & Unternehmen */}
                                        <AnimatePresence>
                                            {activeDropdown === item.name && item.enhancedDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                                                >
                                                    <div className="p-6">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {item.name === "Standorte" ? (
                                                                locations.map((location, idx) => (
                                                                    <motion.div
                                                                        key={location.slug}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: idx * 0.03 }}
                                                                    >
                                                                        <Link
                                                                            href={`/standorte/${location.slug}`}
                                                                            className="group block p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="text-2xl p-2 rounded-xl transition-transform group-hover:scale-110 bg-white dark:bg-zinc-900">
                                                                                    📍
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h4 className="font-bold text-sm mb-1 group-hover:text-brand-teal transition-colors text-zinc-700 dark:text-zinc-300">
                                                                                        {location.name}
                                                                                    </h4>
                                                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                        Standort {location.name}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </motion.div>
                                                                ))
                                                            ) : (
                                                                (item.name === "Service" ? serviceMenuItems : companyMenuItems).map((menuItem, idx) => (
                                                                    <motion.div
                                                                        key={menuItem.title}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: idx * 0.03 }}
                                                                        className="relative"
                                                                    >
                                                                        <Link
                                                                            href={menuItem.link}
                                                                            className={cn(
                                                                                "group block p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]",
                                                                                menuItem.highlight
                                                                                    ? "bg-gradient-to-br from-brand-teal/10 to-brand-lime/10 border-2 border-brand-teal/20 hover:border-brand-teal/40"
                                                                                    : "bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                                            )}
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                <div className={cn(
                                                                                    "text-2xl p-2 rounded-xl transition-transform group-hover:scale-110",
                                                                                    menuItem.highlight
                                                                                        ? "bg-brand-teal/20"
                                                                                        : "bg-white dark:bg-zinc-900"
                                                                                )}>
                                                                                    {menuItem.icon}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h4 className={cn(
                                                                                        "font-bold text-sm mb-1 group-hover:text-brand-teal transition-colors",
                                                                                        menuItem.highlight
                                                                                            ? "text-brand-dark dark:text-white"
                                                                                            : "text-zinc-700 dark:text-zinc-300"
                                                                                    )}>
                                                                                        {menuItem.title}
                                                                                    </h4>
                                                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                                                                        {menuItem.description}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </motion.div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </motion.div>
                                ))}
                            </motion.nav>

                            {/* Actions */}
                            <motion.div
                                layout
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                className="hidden shrink-0 items-center lg:flex"
                                animate={{ gap: isScrolled ? 8 : 12 }}
                            >
                                <motion.button
                                    layout
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all",
                                        isScrolled ? "p-2" : "p-2.5"
                                    )}
                                >
                                    <Search className={cn("transition-all duration-500", isScrolled ? "w-4 h-4" : "w-5 h-5")} />
                                </motion.button>

                                <Link href="/cart">
                                    <motion.div
                                        layout
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "relative text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all group",
                                            isScrolled ? "p-2" : "p-2.5"
                                        )}
                                    >
                                        <LiftIcon className={cn("transition-transform group-hover:-translate-y-1 duration-500", isScrolled ? "w-5 h-5" : "w-6 h-6")} />
                                        <div className="absolute top-1.5 right-1.5 flex items-center justify-center">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                                            </span>
                                        </div>

                                        {/* Hover Tooltip */}
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                                            Warenkorb
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-900 dark:border-b-zinc-800" />
                                        </div>
                                    </motion.div>
                                </Link>

                                <Link href="/#konfigurator">
                                    <motion.button
                                        layout
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "flex items-center bg-gradient-to-r from-brand-teal to-brand-lime text-white font-bold hover:shadow-lg hover:shadow-brand-teal/30 rounded-xl transition-all duration-500",
                                            isScrolled
                                                ? "gap-1.5 px-4 py-2 text-[13px]"
                                                : "gap-2 px-6 py-2.5 text-sm"
                                        )}
                                    >
                                        <LiftIcon className={cn("transition-all duration-500", isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
                                        <span>Konfigurieren</span>
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden border-t border-zinc-100 dark:border-zinc-800 overflow-hidden"
                            >
                                <div className="px-6 py-4 flex flex-col gap-2">
                                    <div className="mb-1 flex items-center justify-center gap-2">
                                        {socialItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={item.label}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-600 transition-all hover:text-brand-teal dark:bg-zinc-900 dark:text-zinc-300"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <div className="mb-3 grid gap-2 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900/70">
                                        {topBarItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    className="flex items-start gap-3 rounded-xl px-3 py-2 text-zinc-700 transition-colors hover:bg-white hover:text-brand-teal dark:text-zinc-200 dark:hover:bg-zinc-800"
                                                >
                                                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-teal dark:bg-zinc-800">
                                                        <Icon className="h-4 w-4" />
                                                    </span>
                                                    <span>
                                                        <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                                                            {item.label}
                                                        </span>
                                                        <span className="block text-sm font-semibold">
                                                            {item.content}
                                                        </span>
                                                    </span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                    {navItems.map((item) => (
                                        <div key={item.name} className="flex flex-col gap-2">
                                            <Link
                                                href={item.href}
                                                className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-teal px-4 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                            {item.name === "Standorte" && locations.length > 0 && (
                                                <div className="ml-4 flex flex-col gap-1">
                                                    {locations.map((location) => (
                                                        <Link
                                                            key={location.slug}
                                                            href={`/standorte/${location.slug}`}
                                                            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-brand-teal px-4 py-1 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {location.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                        <Link href="/cart" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full py-3 justify-center flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                                                <LiftIcon className="w-5 h-5" /> Merkliste
                                            </button>
                                        </Link>
                                        <Link href="/#konfigurator" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full py-3 justify-center flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lime text-white font-semibold">
                                                <LiftIcon className="w-4 h-4" /> Konfigurieren
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.header>
    );
}
