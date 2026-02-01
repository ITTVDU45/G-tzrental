"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch('/api/admin/blog');
                const data = await res.json();
                const found = data.find((p: any) => p.id === id);
                setPost(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return null;
    if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header Meta */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-10">
                        <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/blog" className="hover:text-brand-teal transition-colors">Blog</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-zinc-900 dark:text-white font-medium truncate">{post.title}</span>
                    </div>

                    <div className="flex flex-col gap-6 mb-12">
                        <div className="flex flex-wrap gap-2">
                            {(post.categories && post.categories.length > 0 ? post.categories : [post.category].filter(Boolean)).map((cat: string) => (
                                <span key={cat} className="bg-brand-teal/10 text-brand-teal px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-teal/20">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-[1.1]">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-8 text-[12px] font-bold text-zinc-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-teal" /> {post.date}</div>
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-teal" /> {post.readTime} Lesezeit</div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,240px] gap-20">
                    <article className="max-w-none">
                        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic border-l-4 border-brand-teal pl-8 mb-12">
                            {post.excerpt}
                        </p>

                        <div
                            className="blog-content space-y-8 text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-medium"
                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                        />

                        {/* Fallback for posts without content (seeding) */}
                        {!post.content && (
                            <div className="space-y-8 text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-medium">
                                <p>
                                    Bei der Arbeit mit Hebebühnen und anderen motorisierten Baumaschinen steht die Sicherheit an erster Stelle. Jedes Jahr ändern sich Anforderungen und Standards, um den Arbeitsalltag noch sicherer zu gestalten. In diesem Ratgeber fassen wir die wichtigsten Neuerungen zusammen.
                                </p>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-12 mb-6">
                                    Unterweisung ist Pflicht
                                </h2>
                                <p>
                                    Eine der am häufigsten unterschätzten Regeln ist die jährliche Sicherheitsunterweisung. Es reicht nicht aus, das Gerät einmal bedient zu haben. Jeder Bediener muss nachweislich in die spezifischen Funktionen und Gefahrenquellen eingewiesen sein.
                                </p>
                            </div>
                        )}

                        <style jsx global>{`
                            .blog-content h1 { font-size: 3rem; font-weight: 900; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.05em; color: var(--brand-dark, #18181b); }
                            .blog-content h2 { font-size: 2.25rem; font-weight: 900; text-transform: uppercase; margin-top: 2.5rem; margin-bottom: 1.25rem; letter-spacing: -0.025em; color: var(--brand-dark, #18181b); }
                            .blog-content h3 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-top: 2rem; margin-bottom: 1rem; color: var(--brand-dark, #18181b); }
                            .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3 { color: white; }
                            .blog-content p { margin-bottom: 1.5rem; }
                            .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                            .blog-content li { margin-bottom: 0.5rem; }
                            .blog-content a { color: #008080; text-decoration: underline; font-weight: 700; }
                            .blog-content blockquote { border-left: 4px solid #008080; padding-left: 1.5rem; font-style: italic; color: #71717a; }
                        `}</style>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-12">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Teilen</h4>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-600' },
                                        { name: 'Twitter', icon: Twitter, color: 'hover:bg-zinc-900' },
                                        { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-700' }
                                    ].map(social => (
                                        <button key={social.name} className={`flex items-center justify-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-white transition-all duration-300 ${social.color}`}>
                                            <social.icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-brand-dark text-white shadow-2xl shadow-brand-dark/20">
                                <h4 className="font-black uppercase text-sm mb-4">Fragen zum Thema?</h4>
                                <p className="text-xs text-zinc-400 mb-6 font-medium leading-relaxed">
                                    Unsere Experten beraten Sie gerne persönlich zu Sicherheitsfragen.
                                </p>
                                <Link href="/kontakt">
                                    <button className="w-full py-4 rounded-xl bg-brand-teal text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                                        Kontakt aufnehmen
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Back Link */}
                <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/blog" className="flex items-center gap-3 text-brand-dark dark:text-white font-black uppercase text-xs tracking-widest group">
                        <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>
        </div>
    );
}
