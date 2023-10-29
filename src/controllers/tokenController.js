const Token = require("../models/token");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");
const { generateAccessToken, verifyToken, verifyRefreshToken } = require("../auth/auth");

// Controlador para criar um novo token
async function createToken(user) {
  try {
    const token = await tokenService.createToken(user.id, user.token, user.refreshToken);
    return token;
  } catch (error) {
    throw new Error("Erro ao criar o token");
  }
}

// Controlador para buscar um token pelo ID do usuário
async function getTokenByUserId(req, res) {
  try {
    const token = await Token.findByUserId(userId);
    return token;
  } catch (error) {
    throw new Error("Erro ao buscar o token");
  }
}

// Controlador para atualizar um token
async function updateToken(req, res) {
  try {
    let { uuid } = req.params;
    const { jwt_token, refresh_token } = req.body;
    
    const existingUser = await userService.checkUserExists(uuid);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const decodedToken = verifyToken(jwt_token);

    if (decodedToken) {
      return res.status(404).json({ error: "Token valido" });
    }

    const decodedRefreshToken = verifyRefreshToken(refresh_token);

    if (!decodedRefreshToken) {
      return res.status(401).json({ error: "Refresh token inválido" });
    }

    const user = await userService.getUserByUuid(uuid);

    const newToken = generateAccessToken(user);

    const token = await Token.update({
      userUuid: uuid,
      jwtToken: newToken,
      updatedAt: new Date(),
    });

    delete token.user_uuid;
    delete token.created_at;
    delete token.deleted_at;

    res.json(token);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o token" });
  }
}

// Controlador para excluir um token pelo ID do usuário
async function softDeleteTokenByUserId(userId) {
  try {
    await tokenService.softDeleteTokenByUserId(userId);
  } catch (error) {
    throw new Error("Erro ao excluir o token");
  }
}

// Controlador para restaurar um token pelo UUID do usuário
async function restoreTokenByUserUuid(userUuid) {
  try {
    await Token.restoreByUserUuid(userUuid);
  } catch (error) {
    throw new Error("Erro ao restaurar o token");
  }
}

module.exports = {
  createToken,
  getTokenByUserId,
  updateToken,
  softDeleteTokenByUserId,
  restoreTokenByUserUuid,
};
