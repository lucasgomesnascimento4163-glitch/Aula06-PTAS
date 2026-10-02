// Comentado para responder questão 3: persistir passwordHash no usuário e implementar verifyPassword
// com uma biblioteca de hashing antes de habilitar autenticação
// export async function authenticateUser({ id, email, password }) {
//   const user = id !== undefined
//     ? await usersModel.findById(Number(id))
//     : (await usersModel.findAll()).find(candidate => candidate.email === email);
//
//   if (!user || !(await verifyPassword(password, user.passwordHash))) {
//     throw new Error('Credenciais inválidas');
//   }
//
//   return { id: user.id, email: user.email };
// }