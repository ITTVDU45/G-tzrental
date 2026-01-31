import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/admin/testimonials');
                const data = await res.json();
                setTestimonials(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth > 768 ? 900 : 350;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (loading || testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-[#f8f9fb] overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <span className="px-4 py-1.5 bg-brand-teal/10 text-brand-teal text-xs font-bold rounded-full uppercase tracking-widest">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark">
                            Was unsere Kunden sagen
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll("left")}
                            className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm group"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-300 shadow-sm group"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-12 snap-x scrollbar-none px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-shrink-0 w-[90vw] md:w-[900px] snap-center"
                        >
                            <div className={`flex flex-col md:flex-row items-stretch gap-0 md:gap-0 rounded-[3rem] overflow-hidden shadow-xl bg-white border border-brand-dark/5 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                                }`}>
                                {/* Image Block */}
                                <div className="w-full md:w-5/12 aspect-[4/3] md:aspect-auto relative">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>

                                {/* Content Block */}
                                <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-brand-dark font-bold text-lg">{item.rating}</p>
                                            <div className="flex gap-1 text-orange-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-current" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-lg md:text-2xl leading-relaxed font-medium italic">
                                            "{item.text}"
                                        </p>

                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="text-2xl font-bold text-brand-dark">{item.name}</h4>
                                            <p className="text-brand-teal font-medium text-lg">{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
