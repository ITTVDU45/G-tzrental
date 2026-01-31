"use client";

import { HeroSection } from "@/components/about/HeroSection";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { MissionSection } from "@/components/about/MissionSection";
import { HistorySection } from "@/components/about/HistorySection";
import { CareerSection } from "@/components/about/CareerSection";
import { AssociationsSection } from "@/components/about/AssociationsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-0">
            {/* 1. Hero / Intro Section */}
            <HeroSection />

            {/* 2. Philosophy & Services */}
            <CertificationsSection />

            {/* 3. Mission & Motivation */}
            <MissionSection />

            {/* 4. History Timeline (Dark/Light appropriate) */}
            <HistorySection />

            {/* 5. Career CTA */}
            <CareerSection />

            {/* 6. Associations Grid */}
            <AssociationsSection />

            {/* 7. Blog Section */}
            <BlogSection />

            {/* 8. FAQ Section */}
            <FaqSection />

            {/* 9. Final CTA */}
            <FinalCtaSection />
        </div>
    );
}
