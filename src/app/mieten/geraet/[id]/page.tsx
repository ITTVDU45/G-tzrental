import { use } from "react";
import { notFound } from "next/navigation";
import { products } from "@/data/mockProducts";
import ProductTemplate from "@/components/products/ProductTemplate";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return <ProductTemplate product={product} />;
}

// Optional: Pre-generate some paths if needed, though with a template it's often dynamic
export function generateStaticParams() {
    return products.map((product) => ({
        id: product.id,
    }));
}
