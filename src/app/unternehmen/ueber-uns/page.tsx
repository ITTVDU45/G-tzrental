"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/about/HeroSection";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { MissionSection } from "@/components/about/MissionSection";
import { HistorySection } from "@/components/about/HistorySection";
import { CareerSection } from "@/components/about/CareerSection";
import { AssociationsSection } from "@/components/about/AssociationsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FaqSection } from "@/components/home/FaqSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { I_Any } from "@/lib/types";

export default function AboutPage() {
    const [pageData, setPageData] = useState<I_Any>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch("/api/cms?type=page_company_about", { cache: "no-store" });
                const data = await res.json();
                setPageData(data);
            } catch (error) {
                console.error("Failed to load about page data", error);
            }
        };

        fetchPage();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-0">
            {/* 1. Hero / Intro Section */}
            <HeroSection content={pageData?.heroSection} />

            {/* 2. Philosophy & Services */}
            <CertificationsSection content={pageData?.certificationsSection} />

            {/* 3. Mission & Motivation */}
            <MissionSection content={pageData?.missionSection} />

            {/* 4. History Timeline (Dark/Light appropriate) */}
            <HistorySection
                title={pageData?.historySection?.title}
                subtitle={pageData?.historySection?.subtitle}
                items={pageData?.historySection?.events}
            />

            {/* 5. Career CTA */}
            <CareerSection content={pageData?.careerSection} />

            {/* 6. Associations Grid */}
            <AssociationsSection
                title={pageData?.associationsSection?.title}
                items={pageData?.associationsSection?.items}
            />

            {/* 7. Blog Section */}
            <BlogSection pageId={pageData?.references?.pageId || "page-3"} />

            {/* 8. FAQ Section */}
            <FaqSection
                title={pageData?.faq?.title}
                subtitle={pageData?.faq?.subtitle}
                items={pageData?.faq?.items}
            />

            {/* 9. Testimonials */}
            <TestimonialsSection pageId={pageData?.references?.pageId || "page-3"} />

            {/* 10. Final CTA */}
            <FinalCtaSection />
        </div>
    );
}
