"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
    content?: {
        title?: string;
        accent?: string;
        paragraphs?: string[];
        stats?: { value: string; label: string }[];
        images?: { src: string; alt: string }[];
    };
}

export function HeroSection({ content }: HeroSectionProps) {
    const images = content?.images && content.images.length > 0 ? content.images : [
        { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", alt: "Team meeting" },
        { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", alt: "Management Team" }
    ];
    const paragraphs = content?.paragraphs || [];
    const stats = content?.stats || [];
    return (
        <div className="container mx-auto px-6 mb-24 lg:mb-32">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                {/* Left: Images */}
                <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
                    {/* Back Image (Tilted) */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -6, x: -20 }}
                        animate={{ opacity: 1, rotate: -6, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute z-10 w-[350px] h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800"
                    >
                        <Image
                            src={images[0]?.src || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"}
                            alt={images[0]?.alt || "Team meeting"}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                    {/* Front Image */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 3, x: 20 }}
                        animate={{ opacity: 1, rotate: 3, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute z-20 w-[350px] h-[400px] top-20 left-12 md:left-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800"
                    >
                        <Image
                            src={images[1]?.src || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"}
                            alt={images[1]?.alt || "Management Team"}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>

                {/* Right: Text */}
                <div className="w-full lg:w-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight leading-[1.1]"
                    >
                        {content?.title ? content.title : <>Götz Rental – <span className="text-brand-lime">Alles aus einer Hand</span></>}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
                    >
                        {paragraphs.length > 0 ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
                            <>
                                <p>
                                    Der Slogan „Alles aus einer Hand“ ist seit der Gründung Programm. Was mit der Vermietung von Baumaschinen begann, umfasst heute eine Flotte von mehr als <strong>7.500 Mietgeräten</strong>, die europaweit im Einsatz sind.
                                </p>
                                <p>
                                    Von Arbeitsbühnen über Teleskopstapler bis hin zu Spezialkranen – durch unser vielseitiges Netzwerk und die Mitgliedschaft im Partnerverbund garantieren wir, dass Sie immer die passende Technik zur Verfügung haben.
                                </p>
                            </>
                        )}

                        <div className="pt-6 grid grid-cols-2 gap-4">
                            {(stats.length > 0 ? stats : [{ value: "10+", label: "Standorte" }, { value: "3000+", label: "Partner" }]).map((item) => (
                                <div key={item.label} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="text-3xl font-bold text-brand-teal mb-1">{item.value}</div>
                                    <div className="text-sm font-medium text-zinc-500">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
