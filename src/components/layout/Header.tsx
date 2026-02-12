"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Phone, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
    title: string;
    icon: string;
    description: string;
    link: string;
    highlight?: boolean;
    submenu?: { name: string; link: string }[];
};

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

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [locations, setLocations] = useState<{ name: string; slug: string }[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('/api/admin/pages');
                const data = await res.json();
                if (!Array.isArray(data)) {
                    setLocations([]);
                    return;
                }
                const excludedSlugs = ['/', '/mieten', '/kontakt', '/unternehmen/ueber-uns'];
                const publishedLocations = data
                    .filter((loc: any) =>
                        loc &&
                        loc.status === 'published' &&
                        loc.name &&
                        !excludedSlugs.includes(loc.slug)
                    )
                    .map((loc: any) => {
                        const name = loc.name;
                        return {
                            name: name,
                            slug: name.toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/ä/g, 'ae')
                                .replace(/ö/g, 'oe')
                                .replace(/ü/g, 'ue')
                                .replace(/ß/g, 'ss')
                        };
                    });
                setLocations(publishedLocations);
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        };
        fetchLocations();
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
            <div className="container mx-auto px-0">
                <motion.div
                    className={cn(
                        "relative rounded-[2rem] transition-all duration-500 border",
                        isScrolled
                            ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl border-zinc-200/50 dark:border-zinc-800/50"
                            : "bg-white dark:bg-zinc-900 shadow-xl border-zinc-100 dark:border-zinc-800"
                    )}
                >
                    <div className="px-6 md:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="z-50 shrink-0">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative h-14 w-56 md:h-18 md:w-72"
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
                            <nav className="hidden lg:flex items-center gap-2">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn("group", !item.megaMenu && "relative")}
                                        onMouseEnter={() => setActiveDropdown(item.name)}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-teal dark:hover:text-brand-teal transition-colors rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            {item.name}
                                            {(item.megaMenu || item.enhancedDropdown) && (
                                                <ChevronDown className={cn(
                                                    "w-4 h-4 transition-transform duration-300",
                                                    activeDropdown === item.name && "rotate-180"
                                                )} />
                                            )}
                                        </Link>

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
                                                        <div className="flex gap-12">
                                                            {/* Categories Grid - 4 Columns */}
                                                            <div className="flex-grow grid grid-cols-4 gap-8">
                                                                {megaMenuCategories.map((category, catIndex) => (
                                                                    <motion.div
                                                                        key={category.title}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: catIndex * 0.05 }}
                                                                    >
                                                                        <Link
                                                                            href={`/mieten/${category.title.toLowerCase()}`}
                                                                            className="group/cat flex items-center gap-2 text-base font-bold text-brand-dark dark:text-white mb-6 hover:text-brand-teal transition-colors"
                                                                        >
                                                                            {category.title}
                                                                            <ArrowRight className="w-4 h-4 text-brand-teal group-hover/cat:translate-x-1 transition-transform" />
                                                                        </Link>
                                                                        <ul className="space-y-3">
                                                                            {category.items.map((subItem) => (
                                                                                <li key={subItem}>
                                                                                    <Link
                                                                                        href={`/mieten/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                                                        className="text-[15px] text-zinc-500 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal transition-all block py-0.5 hover:translate-x-1 duration-200"
                                                                                    >
                                                                                        {subItem}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            {/* Featured Section - Right Side */}
                                                            <div className="w-[320px] space-y-4">
                                                                {featuredProducts.map((product, prodIndex) => (
                                                                    <motion.div
                                                                        key={product.title}
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: 0.2 + (prodIndex * 0.1) }}
                                                                    >
                                                                        <Link
                                                                            href={product.link}
                                                                            className="group block relative h-[140px] rounded-3xl overflow-hidden"
                                                                        >
                                                                            <Image
                                                                                src={product.image}
                                                                                alt={product.title}
                                                                                fill
                                                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                                            />
                                                                            {/* Gradient Overlay as in image */}
                                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                                                                            <div className="absolute inset-0 flex items-center px-6">
                                                                                <h4 className="text-white text-lg font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                                                                    {product.title}
                                                                                    <ArrowRight className="w-5 h-5" />
                                                                                </h4>
                                                                            </div>
                                                                        </Link>
                                                                    </motion.div>
                                                                ))}

                                                                {/* Full Rental Park CTA */}
                                                                <Link
                                                                    href="/mieten"
                                                                    className="flex items-center justify-center gap-3 px-6 py-5 bg-[#002B2B] text-white rounded-[1.5rem] font-bold text-base hover:bg-brand-teal transition-all group shadow-lg"
                                                                >
                                                                    <span>Vollständiger Mietpark</span>
                                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                                </Link>
                                                            </div>
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
                            </nav>

                            {/* Actions */}
                            <div className="hidden lg:flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>

                                <Link href="/cart">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all group"
                                    >
                                        <LiftIcon className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
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

                                <motion.a
                                    href="tel:+4912345678900"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="hidden xl:inline">+49 123 456 789</span>
                                </motion.a>

                                <Link href="/#konfigurator">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-brand-teal to-brand-lime text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-teal/30 transition-all"
                                    >
                                        <LiftIcon className="w-4 h-4" />
                                        <span>Konfigurieren</span>
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>

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
                                    {navItems.map((item) => (
                                        <div key={item.name} className="flex flex-col gap-2">
                                            <Link
                                                href={item.href}
                                                className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-teal px-4 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
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
