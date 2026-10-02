import { readUsers, writeUsers } from "../db.js";

export async function findAll() {
  return readUsers();
}

export async function findById(id) {
  const users = await readUsers();
  return users.find(user => user.id === id) ?? null;
}

export async function create(payload) {
  const users = await readUsers();
  const nextId = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
  const user = { id: nextId, nome: payload.nome, email: payload.email };

  await writeUsers([...users, user]);
  return user;
}

export async function createBatch(payloads) {
  const users = await readUsers();
  let nextId = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
  const newUsers = payloads.map(payload => ({
    id: nextId++,
    nome: payload.nome,
    email: payload.email
  }));

  await writeUsers([...users, ...newUsers]);
  return newUsers;
}

export async function update(id, payload) {
  const users = await readUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...payload };
  await writeUsers(users);
  return users[index];
}

export async function saveAll(users) {
  await writeUsers(users);
}