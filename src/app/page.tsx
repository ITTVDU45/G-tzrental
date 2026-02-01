"use client";

import { useState } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategorySlider } from "@/components/home/CategorySlider";
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

export default function Home() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroCarousel onExploreClick={() => setIsSelectorOpen(true)} />
      <CategorySlider />
      <FeatureSection onCtaClick={() => setIsSelectorOpen(true)} />
      <HeightSelector />
      <ProductGridSection />
      <LargeProductCarousel />
      <CtaSection />
      <TestimonialsSection pageId="page-1" />
      <FaqSection />
      <BlogSection pageId="page-1" />
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
