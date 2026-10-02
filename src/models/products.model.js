import { readProducts, writeProducts } from "../db.js";

export async function findAll() {
  return readProducts();
}

export async function findById(id) {
  const products = await readProducts();
  return products.find(product => product.id === id) ?? null;
}

export async function create({ nome, preco }) {
  const products = await readProducts();
  const nextId = products.length
    ? Math.max(...products.map(product => product.id)) + 1
    : 1;
  const product = { id: nextId, nome, preco };

  await writeProducts([...products, product]);
  return product;
}

export async function softDelete(id) {
  const products = await readProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  if (products[index].deletedAt) return { alreadyDeleted: true };

  products[index] = { ...products[index], deletedAt: new Date().toISOString() };
  await writeProducts(products);
  return products[index];
}