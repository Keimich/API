const User = require("../models/user");

// Função para verificar se um usuário existe
async function checkUserExists(uuid) {
  const user = await User.findByUuid(uuid);
  return !!user;
}

// Função para pegar um usuário pelo UUID
async function getUserByUuid(uuid) {
  const user = await User.findByUuid(uuid);
  return user;
}

// Função para atualizar um usuário pelo UUID
async function updateUser(userData) {
  const user = await User.update(userData.uuid, userData);
  return user;
}

// Função para deletar (soft delete) um usuário pelo Id
async function softDeleteUserById(id) {
  const user = await User.softDelete(id);
  return user;
}

// Função para criar um usuário
async function createUser(uuid, name, last_name, email, password) {
  const user = await User.create({
    uuid, 
    name, 
    last_name,
    email,
    password
  });
  return user;
}

module.exports = {
  checkUserExists,
  getUserByUuid,
  updateUser,
  softDeleteUserById,
  createUser
};
