import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/data";
import ProductTemplate from "@/components/products/ProductTemplate";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { id } = await params;
    const [product, allProducts] = await Promise.all([
        getProductById(id),
        getProducts()
    ]);

    if (!product) {
        notFound();
    }

    const alternatives = allProducts
        .filter((p: any) => p.category === product.category && p.id !== id)
        .slice(0, 6);

    return <ProductTemplate product={product} alternatives={alternatives} />;
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product: any) => ({
        id: product.id,
    }));
}
