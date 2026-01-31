"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";

const historyEvents = [
    { year: "2014", title: "Der Anfang", description: "Die Geschichte beginnt." },
    { year: "2017", title: "Übernahme", description: "Start von Götz Rental unter neuer Leitung." },
    { year: "2019", title: "Expansion", description: "Eröffnung des Standorts München und Erweiterung der Flotte." },
    { year: "2021", title: "Ausgründung", description: "Götz Rental wird ein eigenständiges Unternehmen." },
    { year: "2023", title: "Wachstum", description: "Starkes Umsatzwachstum und Verdopplung der Mitarbeiterzahl." },
    { year: "2024", title: "Team", description: "Mittlerweile über 80 Mitarbeiter an Bord." },
    { year: "Heute", title: "Alles aus einer Hand", description: "Über 7.500 Mietgeräte europaweit verfügbar." },
];

export function HistorySection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">Die Geschichte</h2>
                    <p className="text-zinc-500">Von 2014 bis heute – eine Erfolgsstory.</p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                        <ChevronRight className="w-6 h-6 text-zinc-900 dark:text-white" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-6 pb-12 scrollbar-hide snap-x"
            >
                <div className="w-6 shrink-0" /> {/* Spacer */}
                {historyEvents.map((event, i) => (
                    <div key={i} className="snap-center shrink-0 w-[400px] h-[300px] relative rounded-[2rem] bg-white dark:bg-zinc-900 p-8 shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300">
                        <div>
                            <span className="text-6xl font-black text-zinc-100 dark:text-zinc-800 absolute top-6 right-8 select-none z-0">
                                {event.year === "Heute" ? "Now" : event.year}
                            </span>
                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold mb-4">
                                    {event.year}
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{event.title}</h3>
                                <p className="text-zinc-500 leading-relaxed">{event.description}</p>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-brand-teal w-1/3 group-hover:w-full transition-all duration-700" />
                        </div>
                    </div>
                ))}
                <div className="w-6 shrink-0" /> {/* Spacer */}
            </div>
        </section>
    );
}
