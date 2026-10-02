import * as productsModel from "../models/products.model.js";

export async function createProduct(req, res) {
  const { nome, preco } = req.body || {};

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ erro: 'O Produto necessita de um nome válido' });
  }
  if (preco === undefined || typeof preco !== 'number') {
    return res.status(400).json({ erro: 'O Produto necessita de um preço válido' });
  }

  const product = await productsModel.create({ nome, preco });
  res.status(201).json(product);
}

export async function listProducts(req, res) {
  const products = await productsModel.findAll();
  const { min } = req.query;

  if (min) {
    return res.json(products.filter(product => product.preco >= Number(min)));
  }
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await productsModel.findById(Number(req.params.id));
  if (!product) return res.status(404).json({ erro: "Produto não encontrado nesse djacho" });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const result = await productsModel.softDelete(Number(req.params.id));
  if (!result) return res.status(404).json({ erro: 'Produto não encontrado nesse djacho' });
  if (result.alreadyDeleted) return res.status(409).json({ erro: 'Já removido' });
  res.status(204).end();
}

export async function listActiveProducts(_req, res) {
  const products = await productsModel.findAll();
  res.json(products.filter(product => !product.deletedAt));
}