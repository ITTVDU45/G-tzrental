import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface BlogSectionProps {
    pageId?: string;
}

export function BlogSection({ pageId }: BlogSectionProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/admin/blog');
                const data = await res.json();

                if (!Array.isArray(data)) {
                    setPosts([]);
                    return;
                }

                // Filter by status and pageId
                const filtered = data
                    .filter((p: any) => p && p.status === 'published')
                    .filter((p: any) => !pageId || !p.pageIds || p.pageIds.length === 0 || p.pageIds.includes(pageId));

                setPosts(filtered.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [pageId]);

    if (loading || posts.length === 0) return null;

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
                    {posts.map((post, index) => (
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
