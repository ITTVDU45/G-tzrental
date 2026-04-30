"use client";

import { Briefcase, type LucideIcon } from "lucide-react";

interface CareerSectionProps {
    content?: {
        title?: string;
        description?: string;
        ctaLabel?: string;
    };
}

export function CareerSection({ content }: CareerSectionProps) {
    return (
        <div className="container mx-auto px-6 py-24">
            <div className="bg-brand-teal rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                    <BadgeIcon icon={Briefcase} />
                    <h2 className="text-4xl md:text-6xl font-bold">{content?.title || "Karriere bei Götz Rental"}</h2>
                    <p className="text-xl text-white/90">
                        {content?.description || "Auf der Suche nach einer neuen Herausforderung? Wir wachsen weiter und suchen Talente, die mit uns hoch hinaus wollen."}
                    </p>
                    <button className="bg-white text-brand-teal px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-100 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        {content?.ctaLabel || "Jetzt bewerben"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function BadgeIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Icon className="w-8 h-8 text-white" />
        </div>
    );
}
