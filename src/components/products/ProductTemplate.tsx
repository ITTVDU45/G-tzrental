"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronDown,
    ArrowRight,
    Download,
    Info,
    ShieldCheck,
    LayoutGrid,
    Truck,
    Clock,
    User,
    Calendar,
    Send,
    FileEdit,
    Zap,
    Scale,
    Gem,
    ChevronLeft,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductInquiryModal from "./ProductInquiryModal";
import { I_Any } from "@/lib/types";

interface ProductTemplateProps {
    product: I_Any;
    alternatives: I_Any[];
}

export default function ProductTemplate({ product, alternatives }: ProductTemplateProps) {
    const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [showImageZoom, setShowImageZoom] = useState(false);
    const galleryImages = Array.from(
        new Set(
            [product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])]
                .filter((image): image is string => typeof image === "string" && image.length > 0)
        )
    );
    const [activeImage, setActiveImage] = useState<string>(galleryImages[0] || product.image || "");

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                    <Link href="/mieten" className="hover:text-brand-teal transition-colors">Mietpark</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={`/mieten/${product.category.toLowerCase()}`} className="hover:text-brand-teal transition-colors">{product.category}</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-900 dark:text-white font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Hero Section */}
                        <div className="space-y-6">
                            <button
                                type="button"
                                onClick={() => activeImage && setShowImageZoom(true)}
                                className="group relative block w-full aspect-[16/11] bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm"
                            >
                                {activeImage ? (
                                    <Image
                                        src={activeImage}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-widest text-zinc-400">
                                        Kein Bild verfügbar
                                    </div>
                                )}
                                {activeImage && (
                                    <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-widest text-zinc-900 shadow-lg transition-all group-hover:bg-brand-teal group-hover:text-white">
                                        <Search className="h-4 w-4" />
                                        Lupe
                                    </div>
                                )}
                            </button>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                {galleryImages.length > 0 ? (
                                    galleryImages.map((img: string, idx: number) => (
                                        <button
                                            key={`${img}-${idx}`}
                                            type="button"
                                            onClick={() => setActiveImage(img)}
                                            className={cn(
                                                "group relative aspect-square flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] overflow-hidden border transition-all",
                                                activeImage === img
                                                    ? "border-brand-teal ring-2 ring-brand-teal/20 shadow-lg"
                                                    : "border-zinc-100 dark:border-zinc-800 hover:border-brand-teal/40"
                                            )}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} Galerie ${idx + 1}`}
                                                fill
                                                className={cn(
                                                    "object-contain p-5 transition-all duration-300 group-hover:scale-105",
                                                    activeImage === img ? "opacity-100" : "opacity-80"
                                                )}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 flex justify-end p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="rounded-full bg-white/90 p-2 text-zinc-900 shadow-md">
                                                    <Search className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-2 flex aspect-[2/1] items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-zinc-50 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
                                        Keine Galerie-Bilder vorhanden
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Accordions */}
                        <div className="space-y-4">
                            <AccordionItem
                                title="Beschreibung"
                                id="description"
                                isOpen={activeAccordion === "description"}
                                onToggle={() => setActiveAccordion(activeAccordion === "description" ? null : "description")}
                            >
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {product.description || "Keine Beschreibung verfügbar."}
                                </p>
                            </AccordionItem>

                            <AccordionItem
                                title="Versicherung & Schutz"
                                id="insurance"
                                isOpen={activeAccordion === "insurance"}
                                onToggle={() => setActiveAccordion(activeAccordion === "insurance" ? null : "insurance")}
                            >
                                <div className="space-y-4">
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        {product.insuranceText || "Standard Maschinenbruchversicherung inklusive. Sorglos mieten mit unserem Rundum-Schutzpaket."}
                                    </p>
                                </div>
                            </AccordionItem>
                        </div>
                        
                        {/* Insurance Badges displayed below accordions */}
                        {product.insuranceBadges && product.insuranceBadges.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2" suppressHydrationWarning>
                                {product.insuranceBadges.map((badge: { id: string, text: string }) => (
                                    <span key={badge.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold whitespace-nowrap" suppressHydrationWarning>
                                        <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                                        {badge.text}
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Right Column - Info & Booking Card */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Title & Short Info */}
                        <div>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-bold rounded-full mb-4 inline-block">
                                {product.subcategory}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight">
                                {product.name}
                            </h1>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {Array.isArray(product.details) ? (
                                    product.details.map((detail: { id: string, label: string, value: string }) => (
                                        <QuickStat
                                            key={detail.id}
                                            icon={getIconForLabel(detail.label)}
                                            label={detail.label}
                                            value={detail.value}
                                        />
                                    ))
                                ) : (
                                    <>
                                        <QuickStat icon={<LayoutGrid className="w-5 h-5" />} label="Arbeitshöhe" value={product.details.height || "-"} />
                                        <QuickStat icon={<ArrowRight className="w-5 h-5" />} label="Seitl. Reichweite" value={product.details.reach || "-"} />
                                        <QuickStat icon={<User className="w-5 h-5" />} label="max. Korblast" value={product.details.load || "-"} />
                                        <QuickStat icon={<Clock className="w-5 h-5" />} label="Antrieb" value={product.details.power || "-"} />
                                        <QuickStat icon={<Truck className="w-5 h-5" />} label="Breite" value={product.details.transportWidth || "-"} />
                                        <QuickStat icon={<Scale className="w-5 h-5" />} label="Gewicht" value={product.details.weight || "-"} />
                                    </>
                                )}
                            </div>

                            {/* Booking Box */}
                            <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-teal/30 transition-all duration-700" />

                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <p className="text-zinc-400 text-sm mb-1 font-medium">Tagesmiete ab</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-white">{product.price}€</span>
                                            <span className="text-zinc-400 text-sm uppercase font-bold tracking-widest">/ Tag</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Verfügbar</span>
                                        <div className="w-3 h-3 bg-brand-lime rounded-full shadow-[0_0_15px_rgba(157,255,0,0.5)] animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-zinc-400 font-medium">Anzahl</span>
                                        <div className="flex items-center gap-4">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">-</button>
                                            <span className="font-bold text-lg">1</span>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-brand-teal/50 cursor-pointer transition-colors group/link">
                                        <span className="text-zinc-400 font-medium">Sonderkonditionen</span>
                                        <ArrowRight className="w-5 h-5 text-brand-teal group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowInquiryModal(true)}
                                    className="w-full py-5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Mietzeitraum wählen
                                </button>

                                <p className="text-center text-xs text-zinc-500 mt-6 font-medium">
                                    Preise zzgl. MwSt. und Versicherung. <Link href="/konditionen" className="text-brand-teal hover:underline">Mietbedingungen ansehen</Link>
                                </p>
                            </div>
                        </div>

                        {/* USP Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <div className="p-3 bg-white dark:bg-black rounded-2xl w-fit mb-4">
                                    <Truck className="w-5 h-5 text-brand-teal" />
                                </div>
                                <h4 className="font-bold text-zinc-900 dark:text-white mb-2 leading-tight">Schnelle Lieferung</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">Pünktliche Zustellung an Ihren Einsatzort innerhalb von 24h.</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <div className="p-3 bg-white dark:bg-black rounded-2xl w-fit mb-4">
                                    <ShieldCheck className="w-5 h-5 text-brand-teal" />
                                </div>
                                <h4 className="font-bold text-zinc-900 dark:text-white mb-2 leading-tight">24/7 Notfallservice</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">Bei Problemen sind unsere Techniker rund um die Uhr erreichbar.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Data Table */}
                <div className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 uppercase">
                                Technische Daten
                            </h2>
                            <p className="text-zinc-500">Alle Spezifikationen des Modells <strong>{product.name}</strong> auf einen Blick.</p>
                        </div>
                        {product.datasheet && (
                            <a
                                href={product.datasheet}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-8 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-[1.5rem] font-bold transition-all group"
                            >
                                <Download className="w-5 h-5 text-brand-teal group-hover:scale-110 transition-transform" />
                                <span>{product.datasheetName || "Datenblatt herunterladen (PDF)"}</span>
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                        {Array.isArray(product.details) ? (
                            product.details.map((detail: { id: string, label: string, value: string }) => (
                                <div key={detail.id} className="flex justify-between py-4 border-b border-zinc-50 dark:border-zinc-900 group">
                                    <span className="text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">{detail.label}</span>
                                    <span className="font-bold text-zinc-900 dark:text-white group-hover:text-brand-teal transition-colors">{detail.value}</span>
                                </div>
                            ))
                        ) : product.fullSpecs ? (
                            Object.entries(product.fullSpecs).map(([key, value]: [string, I_Any]) => (
                                <div key={key} className="flex justify-between py-4 border-b border-zinc-50 dark:border-zinc-900 group">
                                    <span className="text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">{key}</span>
                                    <span className="font-bold text-zinc-900 dark:text-white group-hover:text-brand-teal transition-colors">{value}</span>
                                </div>
                            ))
                        ) : product.details ? (
                            Object.entries(product.details).map(([key, value]: [string, I_Any]) => {
                                // Simple mapping for legacy details object
                                const labelMap: Record<string, string> = {
                                    height: "Arbeitshöhe",
                                    reach: "Reichweite",
                                    load: "Tragkraft",
                                    power: "Antrieb",
                                    weight: "Gewicht",
                                    transportWidth: "Breite"
                                };
                                if (key === 'id') return null; // Skip id if present
                                return (
                                    <div key={key} className="flex justify-between py-4 border-b border-zinc-50 dark:border-zinc-900 group">
                                        <span className="text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">{labelMap[key] || key}</span>
                                        <span className="font-bold text-zinc-900 dark:text-white group-hover:text-brand-teal transition-colors">{value}</span>
                                    </div>
                                );
                            })
                        ) : null}
                    </div>
                </div>
                {/* How it Works Section */}
                <div className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-16 uppercase">
                        {product.name} mieten - so funktioniert&apos;s
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <StepItem
                            number="1"
                            title="Mietdauer auswählen"
                            description="Verwende unseren Kalender, um die gewünschte Mietdauer auszuwählen."
                            icon={<Calendar className="w-8 h-8" />}
                        />
                        <StepItem
                            number="2"
                            title="Sende uns deine Anfrage"
                            description="Nach deiner unverbindlichen Anfrage erhältst du ein individuelles Angebot."
                            icon={<Send className="w-8 h-8" />}
                        />
                        <StepItem
                            number="3"
                            title="Angebot bestätigen"
                            description="Sobald du unser Angebot bestätigst, wird das Mietgerät verbindlich für dich eingeplant."
                            icon={<FileEdit className="w-8 h-8" />}
                        />
                        <StepItem
                            number="4"
                            title="Mietgerät wird geliefert"
                            description="Wir liefern dein Mietgerät direkt auf die Baustelle – oder du holst es bequem selbst bei uns ab."
                            icon={<Truck className="w-8 h-8" />}
                        />
                    </div>
                </div>

                {/* Additional Benefits Section */}
                <div className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            Weitere Vorteile
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <div className="p-4 bg-brand-teal/10 rounded-2xl w-fit text-brand-teal">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                                Wir sind Experten für Höhenzugangstechnik
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Wenn du eine <Link href="/mieten" className="text-brand-teal hover:underline font-bold">Arbeitsbühne mieten</Link> oder einen <Link href="/mieten" className="text-brand-teal hover:underline font-bold">Stapler mieten</Link> möchtest, sind wir dein erster Ansprechpartner. Alle unsere Mietgeräte erfüllen dank des SYSTEM LIFT Qualitätssiegels höchste Sicherheitsstandards.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-brand-teal/10 rounded-2xl w-fit text-brand-teal">
                                <Scale className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                                Für jedes Projekt das passende Mietgerät
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Bei uns findest du Arbeitsbühnen und Stapler für jede Arbeitshöhe, je nach Typ optional mit Sonderzubehör, Anbaugeräten, die deutschlandweit verfügbar sind. Außerdem hast du jederzeit die Möglichkeit, das Gerät zu wechseln.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-brand-teal/10 rounded-2xl w-fit text-brand-teal">
                                <Gem className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                                Umfangreiche Services rund um Technik
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Bei uns bekommst du mehr als &quot;nur&quot; Vermietung und Verkauf: Unsere umfassenden Services umfassen professionelle Schulungen, regelmäßige UVV-Prüfungen sowie zuverlässige Wartungs- und Reparaturservices durch unser qualifiziertes Technikerteam.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alternatives Carousel */}
                <div className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                            Alternative Produkte
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('alt-scroll');
                                    if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                                }}
                                className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('alt-scroll');
                                    if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                                }}
                                className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        id="alt-scroll"
                        className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <AlternativesList alternatives={alternatives} />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 pt-24 border-t border-zinc-100 dark:border-zinc-800 pb-32">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 uppercase">
                            Fragen zum Produkt?
                        </h2>
                        <p className="text-zinc-500">Antworten auf die häufigsten Fragen rund um die Miete der {product.name}.</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        <ProductFaq question="Wie schnell kann die Bühne geliefert werden?" answer="In der Regel können wir bei heute eingehender Bestellung eine Lieferung am nächsten Werktag realisieren." />
                        <ProductFaq question="Ist ein Bediener im Preis enthalten?" answer="Nein, der Preis gilt für das Sologerät. Wir bieten jedoch auch die Gestellung mit geschultem Personal an." />
                        <ProductFaq question="Benötige ich für dieses Gerät eine PSA?" answer="Ja, bei allen Mast- und Teleskopbühnen ist das Tragen eines Haltegurts mit Kurzsicherung vorgeschrieben." />
                        <ProductFaq question="Kann das Gerät im Außenbereich eingesetzt werden?" answer="Spezifisch bei diesem Modell: Ja, bis zu einer Windgeschwindigkeit von 12,5 m/s." />
                    </div>
                </div>
            </div>

            {/* Sticky Mobile/Bottom Action Bar as in Screenshot 3 */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-2xl"
            >
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 pr-6 flex items-center justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                            {product.image && typeof product.image === 'string' && (
                                <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white leading-tight">{product.name}</h4>
                            <p className="text-brand-teal font-black">ab {product.price}€ <span className="text-xs text-zinc-400 font-bold">/ TAG</span></p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInquiryModal(true)}
                        className="px-8 py-4 bg-brand-dark dark:bg-brand-teal text-white rounded-[1.25rem] font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Mietzeitraum wählen
                    </button>
                </div>
            </motion.div>

            {/* Inquiry Modal */}
            <ProductInquiryModal
                isOpen={showInquiryModal}
                onClose={() => setShowInquiryModal(false)}
                product={product}
            />

            <AnimatePresence>
                {showImageZoom && activeImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
                        onClick={() => setShowImageZoom(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="relative h-[85vh] w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setShowImageZoom(false)}
                                className="absolute right-5 top-5 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-teal"
                            >
                                Schließen
                            </button>
                            <Image
                                src={activeImage}
                                alt={product.name}
                                fill
                                className="object-contain p-6"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Components
function AccordionItem({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
    return (
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm">
            <button
                onClick={onToggle}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <span className="text-lg font-bold text-zinc-800 dark:text-white">{title}</span>
                <ChevronDown className={cn("w-5 h-5 text-brand-teal transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-8">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2 group hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
            <div className="text-brand-teal group-hover:scale-110 transition-transform">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-0.5">{label}</p>
                <p className="font-extrabold text-zinc-900 dark:text-white group-hover:text-brand-teal transition-colors">{value}</p>
            </div>
        </div>
    );
}

function StepItem({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="relative group">
            {/* Number Background */}
            <div className="text-[8rem] font-black text-zinc-100 dark:text-zinc-900/50 absolute -top-16 -left-4 z-0 pointer-events-none group-hover:text-brand-teal/10 transition-colors duration-500">
                {number}
            </div>

            <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center text-brand-teal mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-zinc-100 dark:border-zinc-700">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 leading-tight group-hover:text-brand-teal transition-colors">
                    {number}. {title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

function AlternativesList({ alternatives }: { alternatives: I_Any[] }) {
    return (
        <>
            {alternatives.map((product: I_Any) => (
                <div
                    key={product.id}
                    className="flex-shrink-0 w-[350px] snap-start group relative bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col"
                >
                    {/* Top: Image Area */}
                    <Link href={`/mieten/geraet/${product.id}`} className="relative h-[240px] p-6 flex items-center justify-center overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />
                        {product.image && typeof product.image === 'string' && (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-xl"
                            />
                        )}
                        <div className="absolute top-5 right-5 z-20">
                            <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 dark:border-white/10">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-200">Verfügbar</span>
                            </div>
                        </div>
                    </Link>

                    {/* Bottom: Content Area */}
                    <div className="p-6 flex flex-col flex-1 bg-white dark:bg-zinc-950 rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                        <div className="mb-4">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-teal">
                                {product.subcategory}
                            </span>
                            <h3 className="text-xl font-bold text-brand-dark dark:text-white leading-tight group-hover:text-brand-teal transition-colors">
                                {product.name}
                            </h3>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                            {product.details?.height && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Arbeitshöhe</span>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{product.details.height}</span>
                                </div>
                            )}
                            {product.details?.load && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Tragkraft</span>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{product.details.load}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-900">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 uppercase font-bold">ab</span>
                                <span className="text-xl font-bold text-brand-dark dark:text-white">{product.price}€</span>
                            </div>
                            <Link href={`/mieten/geraet/${product.id}`}>
                                <button className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-teal transition-all">
                                    Mieten
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

function ProductFaq({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden bg-white dark:bg-zinc-900/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
                <span className="font-bold text-zinc-900 dark:text-white">{question}</span>
                <div className={cn("w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-all", isOpen && "bg-brand-teal text-white rotate-180")}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-8 text-zinc-500 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
function getIconForLabel(label: string) {
    const l = label.toLowerCase();
    if (l.includes("höhe") || l.includes("height")) return <LayoutGrid className="w-5 h-5" />;
    if (l.includes("reichweite") || l.includes("reach")) return <ArrowRight className="w-5 h-5" />;
    if (l.includes("last") || l.includes("load") || l.includes("korblast")) return <User className="w-5 h-5" />;
    if (l.includes("antrieb") || l.includes("power")) return <Clock className="w-5 h-5" />; // Or Zap? Using existing Clock for now as per previous code
    if (l.includes("breite") || l.includes("width") || l.includes("transport")) return <Truck className="w-5 h-5" />;
    if (l.includes("gewicht") || l.includes("weight")) return <Scale className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
}
