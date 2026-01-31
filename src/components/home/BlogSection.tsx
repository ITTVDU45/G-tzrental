"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
    }
];

export function BlogSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4">
                            Aktuelles & Ratgeber
                        </h2>
                        <p className="text-zinc-500 max-w-2xl">
                            Bleiben Sie informiert mit Expertenwissen, Branchennews und praktischen Tipps rund um Arbeitsbühnen und Baumaschinen.
                        </p>
                    </div>

                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-brand-teal hover:text-brand-dark dark:hover:text-white font-semibold transition-colors group"
                    >
                        <span>Alle Beiträge</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <Link href={`/blog/${post.id}`} className="block">
                                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800">
                                    {/* Image */}
                                    <div className="relative h-[240px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide text-brand-teal border border-white/50 dark:border-zinc-700">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3 leading-tight group-hover:text-brand-teal transition-colors">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More Link */}
                                        <div className="flex items-center gap-2 text-brand-teal font-semibold text-sm group-hover:gap-3 transition-all">
                                            <span>Weiterlesen</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
