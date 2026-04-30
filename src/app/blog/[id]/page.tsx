"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    ChevronRight,
    Clock,
    FolderOpen,
    Tag,
} from "lucide-react";
import { I_Any } from "@/lib/types";

function BlogArticleCard({
    post,
    compact = false,
}: {
    post: I_Any;
    compact?: boolean;
}) {
    return (
        <Link href={`/blog/${post.id}`} className="block">
            <article className="group overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className={compact ? "relative h-44 overflow-hidden" : "relative h-56 overflow-hidden"}>
                    <Image
                        src={post.image || "/Baustelle2.png"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className={compact ? "space-y-4 p-5" : "space-y-4 p-6"}>
                    <div className="flex flex-wrap gap-2">
                        {(post.categories && post.categories.length > 0 ? post.categories : [post.category].filter(Boolean))
                            .slice(0, compact ? 1 : 2)
                            .map((cat: string) => (
                                <span
                                    key={`${post.id}-${cat}`}
                                    className="rounded-full border border-brand-teal/20 bg-brand-teal/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-teal"
                                >
                                    {cat}
                                </span>
                            ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-brand-teal" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-brand-teal" />
                            {post.readTime}
                        </span>
                    </div>
                    <h3 className={compact ? "text-xl font-black leading-tight text-zinc-900 transition-colors group-hover:text-brand-teal dark:text-white" : "text-2xl font-black leading-tight text-zinc-900 transition-colors group-hover:text-brand-teal dark:text-white"}>
                        {post.title}
                    </h3>
                    <p className="line-clamp-3 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-teal">
                        Weiterlesen
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function BlogDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<I_Any>(null);
    const [posts, setPosts] = useState<I_Any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarIndex, setSidebarIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const [postRes, postsRes] = await Promise.all([
                    fetch(`/api/cms?type=page_blog_post_${id}`, { cache: "no-store" }),
                    fetch("/api/admin/blog", { cache: "no-store" }),
                ]);

                const [postData, postsData] = await Promise.all([postRes.json(), postsRes.json()]);
                setPost(postData?.error ? null : postData);
                setPosts(
                    Array.isArray(postsData)
                        ? postsData.filter((entry: I_Any) => entry.status === "published")
                        : []
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchPost();
    }, [id]);

    const categories = useMemo(() => {
        const unique = new Set<string>();
        posts.forEach((entry) => {
            const entryCategories = entry.categories && entry.categories.length > 0
                ? entry.categories
                : [entry.category].filter(Boolean);

            entryCategories.forEach((cat: string) => unique.add(cat));
        });

        return Array.from(unique);
    }, [posts]);

    const relatedPosts = useMemo(() => {
        if (!post) return [];

        const currentCategories = new Set(
            post.categories && post.categories.length > 0
                ? post.categories
                : [post.category].filter(Boolean)
        );

        const otherPosts = posts.filter((entry) => entry.id !== post.id);
        const prioritized = otherPosts.filter((entry) => {
            const entryCategories = entry.categories && entry.categories.length > 0
                ? entry.categories
                : [entry.category].filter(Boolean);

            return entryCategories.some((cat: string) => currentCategories.has(cat));
        });

        const fallback = otherPosts.filter(
            (entry) => !prioritized.some((related) => related.id === entry.id)
        );

        return [...prioritized, ...fallback];
    }, [post, posts]);

    const sidebarPosts = relatedPosts.slice(0, Math.max(relatedPosts.length, 1));
    const currentSidebarPost = sidebarPosts.length > 0
        ? sidebarPosts[sidebarIndex % sidebarPosts.length]
        : null;

    const bottomPosts = relatedPosts.slice(0, 6);
    const visibleBottomPosts = bottomPosts.slice(bottomIndex, bottomIndex + 3);

    const currentTags = post?.tags && post.tags.length > 0 ? post.tags : [];
    const currentPostCategories = post?.categories && post.categories.length > 0
        ? post.categories
        : [post?.category].filter(Boolean);

    if (loading) return null;
    if (!post) return <div className="flex min-h-screen items-center justify-center">Post not found</div>;

    return (
        <div className="min-h-screen overflow-x-hidden bg-white pb-24 pt-32 dark:bg-zinc-950">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 flex items-center gap-2 overflow-hidden text-sm text-zinc-500">
                        <Link href="/" className="shrink-0 transition-colors hover:text-brand-teal">Home</Link>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                        <Link href="/blog" className="shrink-0 transition-colors hover:text-brand-teal">Blog</Link>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                        <span className="truncate font-medium text-zinc-900 dark:text-white">{post.title}</span>
                    </div>

                    <div className="mb-12 flex flex-col gap-6">
                        <div className="flex flex-wrap gap-2">
                            {currentPostCategories.map((cat: string) => (
                                <span
                                    key={cat}
                                    className="rounded-full border border-brand-teal/20 bg-brand-teal/10 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-brand-teal"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h1 className="max-w-5xl text-4xl font-black uppercase tracking-tighter leading-[1.02] text-zinc-900 md:text-6xl dark:text-white">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-[12px] font-bold uppercase tracking-widest text-zinc-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-brand-teal" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-brand-teal" />
                                {post.readTime} Lesezeit
                            </div>
                        </div>
                    </div>

                    <div className="mb-16 overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <div className="relative aspect-[21/9] min-h-[280px] w-full">
                            <Image
                                src={post.image || "/Baustelle2.png"}
                                alt={post.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
                    <article className="min-w-0">
                        <p className="mb-12 border-l-4 border-brand-teal pl-6 text-xl font-medium italic leading-relaxed text-zinc-600 dark:text-zinc-400 md:pl-8 md:text-2xl">
                            {post.excerpt}
                        </p>

                        <div
                            className="blog-content max-w-none space-y-8 text-lg font-medium leading-relaxed text-zinc-700 dark:text-zinc-300"
                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                        />

                        {!post.content && (
                            <div className="space-y-8 text-lg font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                                <p>
                                    Bei der Arbeit mit Hebebühnen und anderen motorisierten Baumaschinen steht die Sicherheit an erster Stelle. Jedes Jahr ändern sich Anforderungen und Standards, um den Arbeitsalltag noch sicherer zu gestalten. In diesem Ratgeber fassen wir die wichtigsten Neuerungen zusammen.
                                </p>
                                <h2 className="mt-12 mb-6 text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                    Unterweisung ist Pflicht
                                </h2>
                                <p>
                                    Eine der am häufigsten unterschätzten Regeln ist die jährliche Sicherheitsunterweisung. Es reicht nicht aus, das Gerät einmal bedient zu haben. Jeder Bediener muss nachweislich in die spezifischen Funktionen und Gefahrenquellen eingewiesen sein.
                                </p>
                            </div>
                        )}

                        <section className="mt-20 border-t border-zinc-100 pt-12 dark:border-zinc-800">
                            <div className="mb-8 flex items-center justify-between gap-4">
                                <div>
                                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                                        Das könnte Sie auch interessieren
                                    </p>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                        Weitere Artikel
                                    </h2>
                                </div>
                                {bottomPosts.length > 3 && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setBottomIndex((prev) => Math.max(prev - 1, 0))}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-brand-teal hover:text-brand-teal dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBottomIndex((prev) => Math.min(prev + 1, Math.max(bottomPosts.length - 3, 0)))}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-brand-teal hover:text-brand-teal dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {visibleBottomPosts.map((relatedPost) => (
                                    <BlogArticleCard key={relatedPost.id} post={relatedPost} />
                                ))}
                            </div>
                        </section>

                        <div className="mt-20 border-t border-zinc-100 pt-10 dark:border-zinc-800">
                            <Link href="/blog" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-dark dark:text-white">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 transition-all group-hover:bg-brand-teal group-hover:text-white dark:bg-zinc-900">
                                    <ArrowLeft className="h-4 w-4" />
                                </div>
                                Zurück zur Übersicht
                            </Link>
                        </div>

                        <style jsx global>{`
                            .blog-content,
                            .blog-content * {
                              max-width: 100%;
                              overflow-wrap: anywhere;
                            }
                            .blog-content img,
                            .blog-content iframe,
                            .blog-content video,
                            .blog-content table,
                            .blog-content pre {
                              max-width: 100%;
                            }
                            .blog-content h1 { font-size: 3rem; font-weight: 900; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.05em; color: var(--brand-dark, #18181b); line-height: 1.05; }
                            .blog-content h2 { font-size: 2.25rem; font-weight: 900; text-transform: uppercase; margin-top: 2.5rem; margin-bottom: 1.25rem; letter-spacing: -0.025em; color: var(--brand-dark, #18181b); line-height: 1.08; }
                            .blog-content h3 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-top: 2rem; margin-bottom: 1rem; color: var(--brand-dark, #18181b); }
                            .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3 { color: white; }
                            .blog-content p { margin-bottom: 1.5rem; }
                            .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                            .blog-content li { margin-bottom: 0.5rem; }
                            .blog-content a { color: #005b96; text-decoration: underline; font-weight: 700; }
                            .blog-content blockquote { border-left: 4px solid #005b96; padding-left: 1.5rem; font-style: italic; color: #71717a; }
                            .blog-content img { width: 100%; height: auto; border-radius: 1.5rem; margin: 2rem 0; object-fit: cover; }
                            .blog-content pre { overflow-x: auto; border-radius: 1.25rem; padding: 1.25rem; background: #18181b; color: white; }
                            .blog-content table { display: block; overflow-x: auto; }
                            @media (max-width: 768px) {
                              .blog-content h1 { font-size: 2.25rem; }
                              .blog-content h2 { font-size: 1.75rem; }
                              .blog-content h3 { font-size: 1.35rem; }
                            }
                        `}</style>
                    </article>

                    <aside className="min-w-0">
                        <div className="space-y-8 lg:sticky lg:top-32">
                            <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50 p-7 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-5 flex items-center gap-3">
                                    <FolderOpen className="h-4 w-4 text-brand-teal" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                                        Kategorien
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {currentSidebarPost && (
                                <div className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                                                Weitere Artikel
                                            </p>
                                            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                                Mehr lesen
                                            </h3>
                                        </div>
                                        {sidebarPosts.length > 1 && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSidebarIndex((prev) => (prev - 1 + sidebarPosts.length) % sidebarPosts.length)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-brand-teal hover:text-brand-teal dark:border-zinc-800 dark:text-zinc-300"
                                                >
                                                    <ArrowLeft className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSidebarIndex((prev) => (prev + 1) % sidebarPosts.length)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-brand-teal hover:text-brand-teal dark:border-zinc-800 dark:text-zinc-300"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <motion.div
                                        key={currentSidebarPost.id}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <BlogArticleCard post={currentSidebarPost} compact />
                                    </motion.div>
                                </div>
                            )}

                            <div className="rounded-[2rem] bg-brand-dark p-7 text-white shadow-2xl shadow-brand-dark/15">
                                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-brand-lime/80">
                                    Projekt starten
                                </p>
                                <h3 className="mb-4 text-2xl font-black uppercase leading-tight">
                                    Jetzt anfragen und passende Lösung finden
                                </h3>
                                <p className="mb-6 text-sm font-medium leading-relaxed text-zinc-300">
                                    Nutzen Sie unseren Konfigurator und erhalten Sie schnell die passende Arbeitsbühne oder das richtige Mietgerät für Ihr Projekt.
                                </p>
                                <Link
                                    href="/#konfigurator"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
                                >
                                    Jetzt anfragen
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {currentTags.length > 0 && (
                                <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50 p-7 dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="mb-5 flex items-center gap-3">
                                        <Tag className="h-4 w-4 text-brand-teal" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                                            Schlagwörter
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {currentTags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-brand-teal/20 bg-brand-teal/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-teal"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
