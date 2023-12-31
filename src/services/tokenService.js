const Token = require("../models/token");

// Função para criar um token
async function createToken(userUuid, jwtToken, refreshToken) {
  const token = await Token.create({
    user_uuid: userUuid,
    jwt_token: jwtToken,
    refresh_token: refreshToken
  });
  return token;
}

// Função para deletar (soft delete) um token pelo userUuid
async function softDeleteTokenByUserUuid(userUuid) {
  await Token.softDeleteByUserUuid(userUuid);
}

module.exports = { createToken, softDeleteTokenByUserUuid };
