const { verifyToken, getTokenFromAuthorizationHeader } = require("../auth/auth");

// Função para verificar se a requisição está autenticada
function isAuthenticated(req, res, next) {
  try {
    const authorizationHeader = req.header("Authorization");
    const token = getTokenFromAuthorizationHeader(authorizationHeader);

    if (!token) {
      return res.status(401).json({ message: "Acesso não autorizado" });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro na validação do token" });
  }
}

module.exports = {
  isAuthenticated,
};
