"use client";

import ConfiguratorShell from "@/components/configurator/core/ConfiguratorShell";
import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Truck, Shield, GraduationCap, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    image: string;
    price: string | number;
    subcategory: string;
    details: any;
    badge?: string;
}

interface Location {
    id: string;
    name: string;
    status: string;
    productIds?: string[];
}

const features = [
    {
        icon: Clock,
        title: "24/7 Notfall Hotline",
        description: "Als Mieter unserer Geräte erreichst du uns rund um die Uhr unter: +49 211 1234567."
    },
    {
        icon: Truck,
        title: "Inklusive Anlieferung",
        description: "Wir liefern gemietete Arbeitsbühnen & Stapler direkt zu deinem Projekt - oder du holst direkt selbst ab."
    },
    {
        icon: Shield,
        title: "Zugangskontrolle",
        description: "Vertraue auf unsere GÖTZ KEY CARD: nie wieder Fremdnutzung von Maschinen. Versprochen."
    },
    {
        icon: GraduationCap,
        title: "SYSTEM-CARD Schulungen",
        description: "Praxisnah, anerkannt, direkt bei uns – zertifizierte SYSTEM-CARD Schulungen für Arbeitsbühnen & Stapler buchen."
    }
];

export default function LocationPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [location, setLocation] = useState<Location | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                // Fetch location by slug
                const locRes = await fetch('/api/admin/pages');
                const locations = await locRes.json();
                const currentLocation = locations.find((loc: Location) =>
                    loc.name.toLowerCase().replace(/\s+/g, '-').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss') === slug
                );

                if (!currentLocation || currentLocation.status !== 'published') {
                    setLoading(false);
                    return;
                }

                setLocation(currentLocation);

                // Fetch all products
                const prodRes = await fetch('/api/admin/products');
                const allProducts = await prodRes.json();

                // Filter products based on location's productIds
                const assignedProducts = allProducts.filter((prod: Product) =>
                    currentLocation.productIds?.includes(prod.id)
                );

                setProducts(assignedProducts);
            } catch (err) {
                console.error('Error fetching location data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();
    }, [slug]);



    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Laden...</p>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Standort nicht gefunden</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Dieser Standort existiert nicht oder ist nicht veröffentlicht.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                        {/* Left: Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-bold text-brand-teal uppercase tracking-wider mb-4"
                            >
                                Arbeitsbühnen am Standort {location.name}
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-[1.1]"
                            >
                                Du möchtest eine Arbeitsbühne in <span className="text-brand-teal">{location.name} mieten?</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                            >
                                Bei GÖTZ RENTAL in {location.name} mietest du flexibel und jederzeit verfügbare Modelle: ob für Bauvorhaben, Wartungsarbeiten oder Events.
                            </motion.p>
                        </div>

                        {/* Right: Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 w-full"
                        >
                            <div className="relative w-full h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000"
                                    alt={`Götz Rental ${location.name}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <p className="text-xs font-bold uppercase tracking-wider mb-2 text-brand-teal">Mietpark {location.name}</p>
                                    <h3 className="text-xl md:text-2xl font-bold">Premium Geräte verfügbar.</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Configurator Embed */}
                    <div className="w-full relative z-10">
                        <ConfiguratorShell locationSlug={slug} />
                    </div>
                </div>
            </section>

            {/* Contact Info Bar */}
            <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Adresse</p>
                            <p className="font-bold text-zinc-900 dark:text-white mb-1">GÖTZ RENTAL Arbeitsbühnen und Stapler</p>
                            <p className="text-zinc-600 dark:text-zinc-400">Musterstraße 123</p>
                            <p className="text-zinc-600 dark:text-zinc-400">D-40210 {location.name}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">E-Mail</p>
                            <a href={`mailto:${location.name.toLowerCase()}@goetz-rental.de`} className="text-brand-teal font-bold hover:underline">
                                {location.name.toLowerCase()}@goetz-rental.de
                            </a>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Telefon</p>
                            <a href="tel:+492111234567" className="text-brand-teal font-bold hover:underline">
                                +49 211 1234567
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Equipment */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                            Beliebte Arbeitsbühnen in {location.name}
                        </h2>
                    </div>

                    {products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col"
                                    >
                                        {/* Top: Image Area */}
                                        <div className="relative h-[260px] p-6 flex items-center justify-center overflow-hidden">
                                            {/* Decorative circle blur for depth */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />

                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-xl"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-100/50 dark:bg-zinc-800/50 flex items-center justify-center">
                                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Kein Bild verfügbar</span>
                                                </div>
                                            )}

                                            {/* Availability Badge (Top Right) */}
                                            <div className="absolute top-5 right-5 z-20">
                                                <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 dark:border-white/10">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-200">Verfügbar</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom: Content Area */}
                                        <div className="p-6 flex flex-col flex-1 bg-white dark:bg-zinc-950 rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                                            {/* Title & Category */}
                                            <div className="mb-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-teal">
                                                        {product.subcategory}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-brand-dark dark:text-white leading-tight group-hover:text-brand-teal transition-colors">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-8">
                                                {product.details?.height && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Arbeitshöhe</span>
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.height}</span>
                                                    </div>
                                                )}
                                                {product.details?.reach && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Reichweite</span>
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.reach}</span>
                                                    </div>
                                                )}
                                                {product.details?.load && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Tragkraft</span>
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.load}</span>
                                                    </div>
                                                )}
                                                {product.details?.power && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Antrieb</span>
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{product.details.power}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer: Price & Action */}
                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-900">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Tagesmiete</span>
                                                    <div className="flex items-baseline gap-0.5">
                                                        <span className="text-2xl font-bold text-brand-dark dark:text-white">{product.price}€</span>
                                                        <span className="text-xs text-zinc-400 font-medium">/Tag</span>
                                                    </div>
                                                </div>

                                                <Link href={`/mieten/geraet/${product.id}`}>
                                                    <button className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-teal dark:hover:bg-brand-teal dark:hover:text-white transition-all duration-300 shadow-xl shadow-brand-dark/10 hover:shadow-brand-teal/20 transform hover:-translate-y-1">
                                                        Mieten
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center">
                                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-brand-teal text-brand-teal font-bold hover:bg-brand-teal hover:text-white transition-colors">
                                    Alle anzeigen
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                                Derzeit sind keine Produkte für diesen Standort verfügbar.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <feature.icon className="w-8 h-8 text-brand-teal" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
