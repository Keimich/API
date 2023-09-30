const { verifyToken } = require("../auth/auth");

// Função para verificar se a requisição está autenticada e se o token pertence ao usuário
function validateUserToken(req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Acesso não autorizado" });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    const { id } = req.params;

    if (decodedToken.id != id) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro na validação do token" });
  }
}

module.exports = {
  validateUserToken,
};
