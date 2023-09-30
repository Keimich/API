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

module.exports = {
  checkUserExists,
  getUserById
};
