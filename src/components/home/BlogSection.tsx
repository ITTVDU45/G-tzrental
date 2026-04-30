import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { I_Any } from "@/lib/types";

interface BlogSectionProps {
    pageId?: string;
    title?: string;
    subtitle?: string;
}

export function BlogSection({ pageId, title, subtitle }: BlogSectionProps) {
    const [posts, setPosts] = useState<I_Any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/cms?type=blog', { cache: 'no-store' });
                const data = await res.json();

                if (!Array.isArray(data)) {
                    setPosts([]);
                    return;
                }

                const filtered = data
                    .filter((p: I_Any) => {
                        if (!p || p.status !== 'published') return false;
                        if (!pageId) return true;

                        const pageIds = Array.isArray(p.pageIds) ? p.pageIds : [];
                        return pageIds.length === 0 || pageIds.includes(pageId);
                    })
                    .slice(0, 8);

                setPosts(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [pageId]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (loading || posts.length === 0) return null;

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4">
                            {title || "Aktuelles & Ratgeber"}
                        </h2>
                        <p className="text-zinc-500 max-w-2xl">
                            {subtitle || "Bleiben Sie informiert mit Expertenwissen, Branchennews und praktischen Tipps rund um Arbeitsbühnen und Baumaschinen."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/blog"
                            className="hidden md:flex items-center gap-2 text-brand-teal hover:text-brand-dark dark:hover:text-white font-semibold transition-colors group"
                        >
                            <span>Alle Beiträge</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scroll("left")}
                                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Blog Slider */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto py-8 snap-x scrollbar-none pb-12"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex-shrink-0 snap-start w-[300px] md:w-[380px]"
                        >
                            <Link href={`/blog/${post.id}`} className="block h-full">
                                <div className="h-full bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-[240px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        {post.image && typeof post.image === 'string' && (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}

                                        {/* Category Badges */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {(post.categories && post.categories.length > 0 ? post.categories : [post.category].filter(Boolean)).map((cat: string) => (
                                                <span key={cat} className="px-3 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wide text-brand-teal border border-white/50 dark:border-zinc-700">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
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
                                        <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3 leading-tight group-hover:text-brand-teal transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More Link */}
                                        <div className="flex items-center gap-2 text-brand-teal font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                                            <span>Weiterlesen</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
                
                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-brand-teal hover:text-brand-dark dark:hover:text-white font-semibold transition-colors group"
                    >
                        <span>Alle Beiträge anzeigen</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
