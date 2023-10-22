const Token = require("../models/token");

// Função para criar um token
async function createToken(userId, jwtToken, refreshToken) {
  const token = await Token.create({
    userId,
    jwtToken,
    refreshToken,
  });
  return token;
}

// Função para deletar (soft delete) um token pelo userId
async function softDeleteTokenByUserId(userId) {
  await Token.softDeleteByUserId(userId);
}

module.exports = { createToken, softDeleteTokenByUserId };
