const { verifyToken } = require('../auth/auth');

// Função para verificar se a requisição está autenticada
function isAuthenticated(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  next();
}

module.exports = {
  isAuthenticated,
};
