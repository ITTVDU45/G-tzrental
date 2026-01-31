"use client";

import Image from "next/image";
import { FileCheck, Globe } from "lucide-react";

export function MissionSection() {
    return (
        <div className="container mx-auto px-6 mb-32">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="w-full lg:w-1/2">
                    <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                        <Image
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000"
                            alt="Construction Vision"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-12 left-12 text-white">
                            <div className="text-sm font-bold uppercase tracking-wider mb-2 text-brand-lime">Unsere DNA</div>
                            <div className="text-3xl font-bold">Gemeinsam das Beste bauen.</div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                        Das sind wir – <span className="text-brand-teal">Götz Rental</span>
                    </h2>
                    <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <p>
                            Wir bieten unseren Kunden aus der Bauindustrie innovative Lösungen, um gemeinsam Projekte erfolgreich umzusetzen. Mit Götz Rental haben wir erfolgreiche Mietkonzepte entwickelt, die sämtliche Prozesse rund um das Thema Vermietung von Bautechnik optimieren und vereinfachen.
                        </p>
                        <p>
                            Unter dem Dach der Götz Rental GmbH arbeiten mittlerweile über 80 Mitarbeiter daran, unseren Service, sowie unsere internen Abläufe immer weiter zu verbessern und die Anmietung für unsere Kunden noch leichter und schneller zu machen.
                        </p>
                        <p>
                            Unser Ziel ist es, Ihnen von der ersten Beratung bis zur Rechnungsstellung einen umfassenden Service zu bieten – alles aus einer Hand. Wir verstehen uns nicht nur als Vermieter, sondern als Ihr Partner auf der Baustelle.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <FileCheck className="w-8 h-8 text-brand-teal mb-4" />
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Einfachheit</h4>
                            <p className="text-sm text-zinc-500">Unkomplizierte Mietprozesse und klare Kommunikation.</p>
                        </div>
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <Globe className="w-8 h-8 text-brand-lime mb-4" />
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Verfügbarkeit</h4>
                            <p className="text-sm text-zinc-500">Europaweites Netzwerk für maximale Flexibilität.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
