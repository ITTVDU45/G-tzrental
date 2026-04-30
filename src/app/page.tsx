"use client";

import { useEffect, useState } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeatureSection } from "@/components/home/FeatureSection";
import { HeightSelector } from "@/components/home/HeightSelector";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { LargeProductCarousel } from "@/components/home/LargeProductCarousel";
import { CtaSection } from "@/components/home/CtaSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { ProductSelector } from "@/components/products/ProductSelector";
import { I_Any } from "@/lib/types";

export default function Home() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [pageData, setPageData] = useState<I_Any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch("/api/cms?type=page_home", { cache: "no-store" });
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("Failed to load home page data", error);
      }
    };

    fetchPage();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroCarousel
        onExploreClick={() => setIsSelectorOpen(true)}
        items={pageData?.hero?.slides}
      />
      <ProductGridSection />
      <FeatureSection
        onCtaClick={() => setIsSelectorOpen(true)}
        content={pageData?.featureSection}
      />
      <HeightSelector content={pageData?.heightSelector} />
      <LargeProductCarousel
        title={pageData?.highlightCarousel?.title}
        items={pageData?.highlightCarousel?.items}
      />
      <CtaSection />
      <TestimonialsSection pageId={pageData?.references?.pageId || "page-1"} />
      <FaqSection
        title={pageData?.faq?.title}
        subtitle={pageData?.faq?.subtitle}
        items={pageData?.faq?.items}
      />
      <BlogSection
        pageId={pageData?.references?.pageId || "page-1"}
        title={pageData?.blogSection?.title}
        subtitle={pageData?.blogSection?.subtitle}
      />
      <FinalCtaSection />

      <ProductSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(product) => {
          console.log("Selected:", product);
          setIsSelectorOpen(false);
          // TODO: Navigate to checkout or product details
        }}
      />
    </div>
  );
}
