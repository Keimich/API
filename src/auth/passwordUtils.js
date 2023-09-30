const bcrypt = require("bcrypt");
const saltRounds = 10;

// Função para gerar hash da senha
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

// Função para verificar hash da senha
async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
