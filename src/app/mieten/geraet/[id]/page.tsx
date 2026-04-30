import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/data";
import { getProductPageDocument } from "@/lib/frontend-pages";
import ProductTemplate from "@/components/products/ProductTemplate";
import { I_Any } from "@/lib/types";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { id } = await params;
    const [product, allProducts, pageData] = await Promise.all([
        getProductById(id),
        getProducts(),
        getProductPageDocument(id),
    ]);

    if (!product) {
        notFound();
    }

    const alternatives = allProducts
        .filter((p: I_Any) => p.category === product.category && p.id !== id)
        .slice(0, pageData?.references?.alternativeLimit || 6);

    return <ProductTemplate product={product} alternatives={alternatives} />;
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product: I_Any) => ({
        id: product.id,
    }));
}
