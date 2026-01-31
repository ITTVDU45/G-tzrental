"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogListingPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/admin/blog');
                const data = await res.json();
                setPosts(data.filter((p: any) => p.status === 'published'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                    <Link href="/" className="hover:text-brand-teal">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-900 dark:text-white font-medium">Blog & Ratgeber</span>
                </div>

                <div className="max-w-4xl mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-6">
                        Aktuelles & Fachwissen
                    </h1>
                    <p className="text-xl text-zinc-500 font-medium leading-relaxed">
                        Entdecken Sie unsere neuesten Beiträge zu Arbeitssicherheit, Gerätewahl und Branchen-News.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <Link href={`/blog/${post.id}`}>
                                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-500">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-teal border border-white/50 dark:border-zinc-700">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</div>
                                            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight group-hover:text-brand-teal transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-brand-teal font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                            Weiterlesen <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
