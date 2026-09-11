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

function nextId(users) {
  return users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
}

export function findAll(users) {
  return users;
}

export function findById(users, id) {
  if (users.length === 0) return null;
  return users.find(user => user.id === id) ?? null;
}

export function create(users, payload) {
  const emailExiste = users.some(user => user.email === payload.email);
  if (emailExiste) {
    return { ok: false, erro: 'email já cadastrado' };
  }

  const novoUsuario = {
    id: nextId(users),
    nome: payload.nome,
    email: payload.email
  };

  return { ok: true, users: [...users, novoUsuario], data: novoUsuario };
}

export function createBatch(users, novosUsuariosPayload) {
  let proximoId = nextId(users);
  const novosUsuarios = [];

  for (const usuario of novosUsuariosPayload) {
    novosUsuarios.push({
      id: proximoId,
      nome: usuario.nome,
      email: usuario.email
    });
    proximoId++;
  }

  return [...users, ...novosUsuarios];
}

export function update(users, id, payload) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return { ok: false, erro: 'Usuário não encontrado' };

  const novosUsuarios = [...users];
  novosUsuarios[index] = { ...novosUsuarios[index], ...payload };
  return { ok: true, users: novosUsuarios, data: novosUsuarios[index] };
}

export function remove(users, id, force = false) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return { ok: false, erro: 'Usuário não encontrado nesse djacho' };

  const novosUsuarios = [...users];

  if (force) {
    novosUsuarios.splice(index, 1);
  } else {
    if (novosUsuarios[index].deletedAt) return { ok: false, erro: 'Já removido' };
    novosUsuarios[index] = {
      ...novosUsuarios[index],
      deletedAt: new Date().toISOString()
    };
  }

  return { ok: true, users: novosUsuarios };
}
