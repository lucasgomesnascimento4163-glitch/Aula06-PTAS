import express from 'express';
import { readUsers, writeUsers, readProducts, writeProducts } from "./db.js";
import * as userService from "./services/users.js";

const app = express();
app.use(express.json());
const PORT = 3000;

function generateNextId(items) {
  return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

app.post('/users', async (req, res) => {
  const validation = userService.validateUserPayload(req.body);
  if (!validation.ok) return res.status(400).json({ erro: validation.erro });

  const users = await readUsers();
  const result = userService.create(users, validation.data);

  if (!result.ok) return res.status(409).json({ erro: result.erro });

  await writeUsers(result.users);
  res.status(201).json(result.data);
});

app.post('/users/batch', async (req, res) => {
  const novosUsuarios = req.body;

  if (!Array.isArray(novosUsuarios)) {
    return res.status(400).json({ erro: 'O body deve ser um array' });
  }

  for (const usuario of novosUsuarios) {
    const validation = userService.validateUserPayload(usuario);
    if (!validation.ok) return res.status(400).json({ erro: validation.erro });
  }

  const users = await readUsers();
  const updatedUsers = userService.createBatch(users, novosUsuarios);

  await writeUsers(updatedUsers);
  res.status(201).json(updatedUsers.slice(users.length));
});

app.get('/users', async (req, res) => {
  const users = await readUsers();
  res.json(userService.findAll(users));
});

app.get('/users/:id', async (req, res) => {
  const users = await readUsers();
  const user = userService.findById(users, Number(req.params.id));
  
  if (!user) return res.status(404).json({ erro: "Usuário não encontrado nesse djacho" });
  res.json(user);
});

app.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const force = req.query.force === 'true';
  const users = await readUsers();
  
  const result = userService.remove(users, id, force);
  if (!result.ok) {
    const statusCode = result.erro.includes('Não encontrado') ? 404 : 409;
    return res.status(statusCode).json({ erro: result.erro });
  }

  await writeUsers(result.users);
  res.status(204).end();
});

app.post('/products', async (req, res) => {
  const { nome, preco } = req.body || {};

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ erro: 'O Produto necessita de um nome válido' });
  }
  if (preco === undefined || typeof preco !== 'number') {
    return res.status(400).json({ erro: 'O Produto necessita de um preço válido' });
  }

  const products = await readProducts();
  const novo = { 
    id: generateNextId(products), 
    nome, 
    preco 
  };

  products.push(novo);
  await writeProducts(products);
  res.status(201).json(novo);
});

app.get("/products", async (req, res) => {
  const { min } = req.query;
  const products = await readProducts();
  
  if (min) {
    return res.json(products.filter(product => product.preco >= Number(min)));
  }
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
  const products = await readProducts();
  const product = products.find(product => product.id === Number(req.params.id));
  
  if (!product) return res.status(404).json({ erro: "Produto não encontrado nesse djacho" });
  res.json(product);
});

app.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const products = await readProducts();
  const product = products.find(product => product.id === id);
  
  if (!product) return res.status(404).json({ erro: 'Produto não encontrado nesse djacho' });
  if (product.deletedAt) return res.status(409).json({ erro: 'Já removido' });

  product.deletedAt = new Date().toISOString();
  await writeProducts(products);
  res.status(204).end();
});

app.get("/products/actives", async (req, res) => {
  const products = await readProducts();
  res.json(products.filter(product => !product.deletedAt));
});

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
