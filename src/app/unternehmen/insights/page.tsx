"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Filter, X } from "lucide-react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { cn } from "@/lib/utils";

const categories = ["Alle", "Sicherheit", "Ratgeber", "Wartung", "News", "Technik"];

const blogPosts = [
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

export default function InsightsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Alle");

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "Alle" || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero Section - Card Style */}
            <section className="py-6 md:py-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden rounded-[3rem] bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 bg-black/50 z-10" />
                        <Image
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000"
                            alt="GÖTZ Insights"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex items-center">
                            <div className="container mx-auto px-8 md:px-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="max-w-3xl"
                                >
                                    <span className="inline-block px-4 py-1.5 bg-brand-teal text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                                        Wissen & News
                                    </span>
                                    <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                                        GÖTZ <span className="text-brand-teal">Insights</span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md max-w-2xl">
                                        Interessante Experten-Einblicke, aktuellste Branchennews und wertvolle Praxistipps rund um das Thema Arbeitsbühnen und Höhenzugangstechnik.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="sticky top-24 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-y border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                        {/* Search Bar */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-teal transition-colors" />
                            <input
                                type="text"
                                placeholder="Beiträge durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-500" />
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                            <div className="flex-shrink-0 flex items-center gap-2 mr-2 border-r border-zinc-200 dark:border-zinc-800 pr-4 hidden lg:flex text-zinc-400">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Kategorien</span>
                            </div>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                                        selectedCategory === cat
                                            ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="group"
                                    >
                                        <Link href={`/blog/${post.id}`} className="block">
                                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-zinc-100 dark:border-zinc-800 h-full flex flex-col">
                                                {/* Image Area */}
                                                <div className="relative h-[280px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    {/* Floating Badge */}
                                                    <div className="absolute top-6 left-6">
                                                        <span className="px-4 py-2 bg-white/95 dark:bg-black/90 backdrop-blur-md rounded-2xl text-xs font-bold uppercase tracking-wider text-brand-teal shadow-xl border border-white/50 dark:border-zinc-700">
                                                            {post.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content Area */}
                                                <div className="p-8 flex flex-col flex-1">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-6 mb-4 text-sm text-zinc-400">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{post.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{post.readTime}</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight group-hover:text-brand-teal transition-colors">
                                                        {post.title}
                                                    </h3>

                                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="mt-auto flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                                        <span className="text-brand-teal font-bold group-hover:gap-4 transition-all inline-flex items-center gap-2">
                                                            Beitrag lesen
                                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.article>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
                                    <Search className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Keine Beiträge gefunden</h3>
                                <p className="text-zinc-500">Versuchen Sie es mit einem anderen Suchbegriff oder einer anderen Kategorie.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("Alle"); }}
                                    className="mt-6 text-brand-teal font-bold hover:underline"
                                >
                                    Filter zurücksetzen
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <FinalCtaSection />
        </div>
    );
}
