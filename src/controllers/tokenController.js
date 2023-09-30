const Token = require("../models/token");
const userService = require("../services/userService");
const { generateAccessToken, verifyToken, verifyRefreshToken } = require("../auth/auth");

// Controlador para criar um novo token
async function createToken(user) {
  try {
    const token = await Token.create({
      user_id: user.id,
      jwt_token: user.token,
      refresh_token: user.refreshToken,
    });

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
    let { id } = req.params;
    userId = ~~id;
    const { jwtToken, refreshToken } = req.body;

    if (typeof userId != "number") {
      return res.status(404).json({ error: "userId inválido" });
    }
    
    const existingUser = await userService.checkUserExists(userId);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const decodedToken = verifyToken(jwtToken);

    if (decodedToken) {
      return res.status(404).json({ error: "Token valido" });
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);

    if (!decodedRefreshToken) {
      return res.status(401).json({ error: "Refresh token inválido" });
    }

    const user = await userService.getUserById(userId);

    const newToken = generateAccessToken(user);

    const token = await Token.update({
      userId: userId,
      jwtToken: newToken,
      updatedAt: new Date(),
    });

    delete token.id;
    delete token.created_at;
    delete token.updated_at;
    delete token.deleted_at;

    res.json(token);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o token" });
  }
}

// Controlador para excluir um token pelo ID do usuário
async function softDeleteTokenByUserId(userId) {
  try {
    await Token.softDeleteByUserId(userId);
  } catch (error) {
    throw new Error("Erro ao excluir o token");
  }
}

// Controlador para restaurar um token pelo ID do usuário
async function restoreTokenByUserId(userId) {
  try {
    await Token.restoreByUserId(userId);
  } catch (error) {
    throw new Error("Erro ao restaurar o token");
  }
}

module.exports = {
  createToken,
  getTokenByUserId,
  updateToken,
  softDeleteTokenByUserId,
  restoreTokenByUserId,
};
