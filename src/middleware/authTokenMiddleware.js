const { verifyToken, verifyRefreshToken, getTokenFromAuthorizationHeader } = require("../auth/auth");

// Função para verificar se a requisição contem o token e o refreshToken validos
function validateToken(req, res, next) {
  try {
    const authorizationHeader = req.header("Authorization");
    const token = getTokenFromAuthorizationHeader(authorizationHeader);
    const { jwtToken, refreshToken } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Token faltando na requisição" });
    }

    const decodedToken = verifyToken(token);

    const { id } = req.params;

    if (decodedToken && decodedToken.id != id) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);

    if (!decodedToken && decodedRefreshToken.id != id) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro na validação do token" });
  }
}

module.exports = {
  validateToken,
};
