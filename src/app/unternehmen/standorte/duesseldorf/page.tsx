"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Truck, Shield, GraduationCap, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BlogSection } from "@/components/home/BlogSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { CategorySlider } from "@/components/home/CategorySlider";

const products = [
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

export default function DuesseldorfPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Handle form submission
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <p className="text-sm font-bold text-brand-teal uppercase tracking-wider mb-4">
                                    Arbeitsbühnen am Standort Düsseldorf
                                </p>
                                <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                                    Du möchtest eine Arbeitsbühne in <span className="text-brand-teal">Düsseldorf mieten?</span>
                                </h1>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Bei GÖTZ RENTAL in Düsseldorf mietest du flexibel und jederzeit verfügbare Modelle: ob für Bauvorhaben, Wartungsarbeiten oder Events – bei uns stehen dir verschiedene moderne und leistungsstarke Arbeitsbühnen zur Auswahl. Von Scheren- über Teleskop- bis hin zu Gelenkteleskopbühnen.
                                </p>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                        />
                                        <input
                                            type="email"
                                            placeholder="E-Mail"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            placeholder="Deine Telefonnummer"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Thema"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Nachricht"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-brand-teal text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-teal/90 transition-colors"
                                    >
                                        Absenden
                                    </button>
                                    <p className="text-xs text-zinc-500 text-center">
                                        Diese Website ist durch hCaptcha geschützt und es gelten die allgemeinen Geschäftsbedingungen und Datenschutzbestimmungen von hCaptcha.
                                    </p>
                                </form>
                            </div>
                        </motion.div>

                        {/* Right: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
                                alt="Götz Rental Düsseldorf Standort"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
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
                            <p className="text-zinc-600 dark:text-zinc-400">D-40210 Düsseldorf</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">E-Mail</p>
                            <a href="mailto:duesseldorf@goetz-rental.de" className="text-brand-teal font-bold hover:underline">
                                duesseldorf@goetz-rental.de
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

            {/* Category Slider - Unser Mietpark */}
            <CategorySlider />

            {/* Why Book Section - Text Left, Image Right */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                                Arbeitsbühnen mieten in Düsseldorf – <span className="text-brand-teal">Flexibel, Sicher, Zuverlässig</span>
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Sie suchen eine Arbeitsbühne zur Miete in Düsseldorf? Bei GÖTZ RENTAL profitieren Sie von einer modernen Mietflotte, die höchste Sicherheitsstandards erfüllt und für jeden Einsatzbereich die passende Lösung bietet.
                            </p>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Ob Scherenbühne für Innenarbeiten, Teleskopbühne für große Höhen oder Gelenkteleskopbühne für schwer zugängliche Bereiche – unsere Arbeitsbühnen sind sofort verfügbar und werden direkt zu Ihrer Baustelle in Düsseldorf und Umgebung geliefert.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-brand-teal">24/7</div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Notfall-Hotline für Mieter</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-brand-teal">100%</div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Geprüfte Sicherheit</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-brand-teal">48h</div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Express-Lieferung möglich</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-brand-teal">500+</div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Geräte am Standort</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=1000"
                                alt="Arbeitsbühnen Vermietung Düsseldorf"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Section - Image Left, Text Right */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl order-2 lg:order-1"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000"
                                alt="Arbeitsbühne mieten Prozess"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 order-1 lg:order-2"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                                So einfach mieten Sie bei uns – <span className="text-brand-teal">In 4 Schritten zur Arbeitsbühne</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Anfrage stellen</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Kontaktieren Sie uns telefonisch, per E-Mail oder über unser Kontaktformular. Teilen Sie uns Ihre Anforderungen mit – wir beraten Sie gerne.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Beratung & Angebot</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Unsere Experten empfehlen Ihnen die passende Arbeitsbühne für Ihr Projekt und erstellen ein individuelles Angebot – transparent und fair.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Lieferung & Einweisung</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Wir liefern die Arbeitsbühne pünktlich zu Ihrem Wunschtermin und weisen Ihr Team vor Ort in die sichere Bedienung ein.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                                        4
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Abholung & Abrechnung</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Nach Projektende holen wir die Arbeitsbühne wieder ab. Sie erhalten eine transparente Abrechnung – ohne versteckte Kosten.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Popular Equipment */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                            Beliebte Arbeitsbühnen in Düsseldorf
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    {product.badge && (
                                        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-brand-teal text-white text-xs font-bold">
                                            {product.badge}
                                        </div>
                                    )}
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{product.name}</h3>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-brand-teal font-bold text-2xl mb-4">
                                        ab {product.price} € /Tag
                                        <span className="text-xs text-zinc-500 ml-1">zzgl. MwSt.</span>
                                    </div>
                                    <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <div className="flex justify-between">
                                            <span>{product.workingHeight}</span>
                                            <span className="text-zinc-400">Arbeitshöhe</span>
                                        </div>
                                        {product.sideReach !== "-" && (
                                            <div className="flex justify-between">
                                                <span>{product.sideReach}</span>
                                                <span className="text-zinc-400">seitl. Reichweite</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>{product.maxLoad}</span>
                                            <span className="text-zinc-400">max. Korblast</span>
                                        </div>
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

            {/* Blog Section */}
            <BlogSection />

            {/* FAQ Section */}
            <FaqSection />

            {/* Final CTA */}
            <FinalCtaSection />
        </div>
    );
}
