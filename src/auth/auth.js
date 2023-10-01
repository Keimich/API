const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require("../../config/config");

// Função para gerar um token JWT
function generateAccessToken(user) {
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

// Função para gerar um refresh token
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_TOKEN_SECRET
  );
  return refreshToken;
}

// Função para verificar um token JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Função para verificar um refresh token
function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Função para retornar o token do authorization header
function getTokenFromAuthorizationHeader(authorization) {
  try {
    const bearer = authorization.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  getTokenFromAuthorizationHeader
};
