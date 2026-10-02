import * as usersService from "../services/users.service.js";

function sendServiceError(res, error) {
  return res.status(error.statusCode || 500).json({ erro: error.message });
}

export async function createUser(req, res) {
  const validation = usersService.validateUserPayload(req.body);
  if (!validation.ok) return res.status(400).json({ erro: validation.erro });

  try {
    const user = await usersService.createUser(validation.data);
    res.status(201).json(user);
  } catch (error) {
    sendServiceError(res, error);
  }
}

export async function createUsersBatch(req, res) {
  const newUsers = req.body;
  if (!Array.isArray(newUsers)) {
    return res.status(400).json({ erro: 'O body deve ser um array' });
  }

  for (const user of newUsers) {
    const validation = usersService.validateUserPayload(user);
    if (!validation.ok) return res.status(400).json({ erro: validation.erro });
  }

  try {
    res.status(201).json(await usersService.createBatch(newUsers));
  } catch (error) {
    sendServiceError(res, error);
  }
}

export async function listUsers(_req, res) {
  res.json(await usersService.findAll());
}

export async function getUser(req, res) {
  const user = await usersService.findById(Number(req.params.id));
  if (!user) return res.status(404).json({ erro: "Usuário não encontrado nesse djacho" });
  res.json(user);
}

export async function updateUser(req, res) {
  try {
    const user = await usersService.updateUser(Number(req.params.id), req.body || {});
    res.json(user);
  } catch (error) {
    sendServiceError(res, error);
  }
}

export async function deleteUser(req, res) {
  try {
    await usersService.removeUser(Number(req.params.id), req.query.force === 'true');
    res.status(204).end();
  } catch (error) {
    sendServiceError(res, error);
  }
}