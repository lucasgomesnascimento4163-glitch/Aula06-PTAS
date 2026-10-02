import * as usersModel from "../models/users.model.js";

function serviceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function validateUserPayload(body) {
  const { nome, email } = body || {};
  if (!nome || typeof nome !== 'string') {
    return { ok: false, erro: 'nome é obrigatório' };
  }
  if (!email || !email.includes('@')) {
    return { ok: false, erro: 'email inválido' };
  }
  return { ok: true, data: { nome, email } };
}

export async function createUser(payload) {
  const users = await usersModel.findAll();
  if (users.some(user => user.email === payload.email)) {
    throw serviceError('email já cadastrado', 409);
  }
  return usersModel.create(payload);
}

export async function updateUser(id, payload) {
  const user = await usersModel.findById(id);
  if (!user) throw serviceError('Usuário não encontrado', 404);

  if (payload.email && (await usersModel.findAll()).some(existing =>
    existing.id !== id && existing.email === payload.email
  )) {
    throw serviceError('email já cadastrado', 409);
  }

  return usersModel.update(id, payload);
}

export async function findAll() {
  return usersModel.findAll();
}

export async function findById(id) {
  return usersModel.findById(id);
}

export async function createBatch(payloads) {
  return usersModel.createBatch(payloads);
}

export async function removeUser(id, force = false) {
  const users = await usersModel.findAll();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) throw serviceError('Usuário não encontrado nesse djacho', 404);

  if (force) {
    users.splice(index, 1);
  } else {
    if (users[index].deletedAt) throw serviceError('Já removido', 409);
    users[index] = { ...users[index], deletedAt: new Date().toISOString() };
  }

  await usersModel.saveAll(users);
}