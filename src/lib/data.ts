import { readDb } from './db';

export async function getProducts() {
    const db = await readDb();
    return db?.products || [];
}

export async function getProductById(id: string) {
    const products = await getProducts();
    return products.find((p: any) => p.id === id);
}

export async function getCategories() {
    const db = await readDb();
    return db?.categories || [];
}
