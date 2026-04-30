import { COLLECTIONS, listSeededCollection } from "@/lib/mongo-admin";
import { products as mockProducts } from "@/data/mockProducts";
import { I_Any } from "@/lib/types";

export async function getProducts() {
    return listSeededCollection(COLLECTIONS.products, "products", mockProducts);
}

export async function getProductById(id: string) {
    const products = await getProducts();
    return products.find((p: I_Any) => p.id === id);
}

export async function getCategories() {
    return listSeededCollection(COLLECTIONS.categories, "categories");
}
