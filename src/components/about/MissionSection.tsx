"use client";

import Image from "next/image";
import { FileCheck, Globe } from "lucide-react";

interface MissionSectionProps {
    content?: {
        title?: string;
        image?: string;
        imageAlt?: string;
        imageBadge?: string;
        imageBadgeTitle?: string;
        paragraphs?: string[];
        values?: { title: string; description: string }[];
    };
}

export function MissionSection({ content }: MissionSectionProps) {
    const paragraphs = content?.paragraphs || [];
    const values = content?.values && content.values.length > 0 ? content.values : [
        { title: "Einfachheit", description: "Unkomplizierte Mietprozesse und klare Kommunikation." },
        { title: "Verfügbarkeit", description: "Europaweites Netzwerk für maximale Flexibilität." }
    ];
    return (
        <div className="container mx-auto px-6 mb-32">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="w-full lg:w-1/2">
                    <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                        <Image
                            src={content?.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000"}
                            alt={content?.imageAlt || "Construction Vision"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-12 left-12 text-white">
                            <div className="text-sm font-bold uppercase tracking-wider mb-2 text-brand-lime">{content?.imageBadge || "Unsere DNA"}</div>
                            <div className="text-3xl font-bold">{content?.imageBadgeTitle || "Gemeinsam das Beste bauen."}</div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                        {content?.title ? content.title : <>Das sind wir – <span className="text-brand-teal">Götz Rental</span></>}
                    </h2>
                    <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {paragraphs.length > 0 ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
                            <>
                                <p>
                                    Wir bieten unseren Kunden aus der Bauindustrie innovative Lösungen, um gemeinsam Projekte erfolgreich umzusetzen. Mit Götz Rental haben wir erfolgreiche Mietkonzepte entwickelt, die sämtliche Prozesse rund um das Thema Vermietung von Bautechnik optimieren und vereinfachen.
                                </p>
                                <p>
                                    Unter dem Dach der Götz Rental GmbH arbeiten mittlerweile über 80 Mitarbeiter daran, unseren Service, sowie unsere internen Abläufe immer weiter zu verbessern und die Anmietung für unsere Kunden noch leichter und schneller zu machen.
                                </p>
                                <p>
                                    Unser Ziel ist es, Ihnen von der ersten Beratung bis zur Rechnungsstellung einen umfassenden Service zu bieten – alles aus einer Hand. Wir verstehen uns nicht nur als Vermieter, sondern als Ihr Partner auf der Baustelle.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        {values.map((item, index) => {
                            const Icon = index === 0 ? FileCheck : Globe;
                            const color = index === 0 ? "text-brand-teal" : "text-brand-lime";
                            return (
                                <div key={item.title} className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <Icon className={`w-8 h-8 ${color} mb-4`} />
                                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h4>
                                    <p className="text-sm text-zinc-500">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
