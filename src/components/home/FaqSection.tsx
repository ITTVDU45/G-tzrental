"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "Wie funktioniert die Miete bei Götz Rental?",
        answer: "Die Miete ist ganz einfach: Wählen Sie Ihr gewünschtes Gerät aus, geben Sie den Mietzeitraum an und schließen Sie die Buchung ab. Wir liefern das Gerät pünktlich zu Ihrem Projekt und holen es nach der Mietdauer wieder ab."
    },
    {
        question: "Welche Arbeitshöhen bieten Sie an?",
        answer: "Unser Sortiment umfasst Arbeitsbühnen von 4m bis über 40m Arbeitshöhe. Von kompakten Scherenbühnen für Innenarbeiten bis zu großen Teleskopbühnen für Außeneinsätze – wir haben die passende Lösung für jede Anforderung."
    },
    {
        question: "Sind die Geräte versichert?",
        answer: "Ja, alle unsere Mietgeräte sind vollständig versichert. Zusätzlich bieten wir optionale Zusatzversicherungen an, um Sie bei Ihrem Projekt optimal abzusichern."
    },
    {
        question: "Bieten Sie auch Schulungen für die Bedienung an?",
        answer: "Selbstverständlich! Wir bieten umfassende Einweisungen und Schulungen für alle Gerätetypen an. Unsere erfahrenen Techniker zeigen Ihnen vor Ort die sichere und effiziente Bedienung."
    },
    {
        question: "Wie kurzfristig kann ich ein Gerät mieten?",
        answer: "Bei Verfügbarkeit können wir Geräte oft schon am nächsten Werktag liefern. Für eine garantierte Verfügbarkeit empfehlen wir eine Buchung 2-3 Tage im Voraus."
    },
    {
        question: "Welche Zahlungsmöglichkeiten gibt es?",
        answer: "Wir akzeptieren Überweisung, Lastschrift und für Geschäftskunden bieten wir auch Rechnungskauf mit individuellen Zahlungszielen an."
    },
    {
        question: "Ist eine Lieferung und Abholung im Preis enthalten?",
        answer: "Die Lieferung innerhalb unseres Standardgebiets ist im Mietpreis enthalten. Für weiter entfernte Standorte berechnen wir eine faire Transportpauschale, die wir Ihnen vorab transparent mitteilen."
    },
    {
        question: "Was passiert bei einem technischen Defekt während der Mietzeit?",
        answer: "Bei technischen Problemen steht Ihnen unser 24/7 Notdienst zur Verfügung. Wir tauschen defekte Geräte umgehend aus oder reparieren sie vor Ort, damit Ihr Projekt nicht ins Stocken gerät."
    },
    {
        question: "Benötige ich einen speziellen Führerschein?",
        answer: "Für die meisten Arbeitsbühnen ist kein spezieller Führerschein erforderlich, jedoch eine Einweisung und ggf. ein Befähigungsnachweis. Für LKW-Bühnen und größere Stapler gelten besondere Anforderungen – wir beraten Sie gerne."
    },
    {
        question: "Kann ich die Mietdauer verlängern?",
        answer: "Ja, eine Verlängerung ist nach Absprache jederzeit möglich. Kontaktieren Sie uns einfach vor Ablauf der ursprünglichen Mietzeit, und wir prüfen die Verfügbarkeit für eine nahtlose Verlängerung."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-6">
                        Häufig gestellte Fragen
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Vermietung.
                        Haben Sie weitere Fragen? Kontaktieren Sie uns gerne!
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto space-y-4 mb-12">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 hover:border-brand-teal/50 transition-colors duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left group"
                            >
                                <span className="text-lg font-bold text-brand-dark dark:text-white pr-8 group-hover:text-brand-teal transition-colors">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDown className="w-5 h-5 text-zinc-400 group-hover:text-brand-teal transition-colors" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-2">
                                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/faq"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-2xl font-bold text-lg hover:bg-brand-teal dark:hover:bg-brand-teal dark:hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
                    >
                        <span>Alle FAQs ansehen</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
