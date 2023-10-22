const User = require("../models/user");

// Função para verificar se um usuário existe
async function checkUserExists(id) {
  const user = await User.findById(id);
  return !!user;
}

// Função para pegar um usuário pelo Id
async function getUserById(id) {
  const user = await User.findById(id);
  return user;
}

// Função para atualizar um usuário pelo Id e usuário (data)
async function updateUser(id, userData) {
  const user = await User.update(id, userData);
  return user;
}

// Função para deletar (soft delete) um usuário pelo Id
async function softDeleteUserById(id) {
  const user = await User.softDelete(id);
  return user;
}

// Função para criar um usuário
async function createUser(username, email, password) {
  const user = await User.create({
    username,
    email,
    password,
  });
  return user;
}

module.exports = {
  checkUserExists,
  getUserById,
  updateUser,
  softDeleteUserById,
  createUser
};
