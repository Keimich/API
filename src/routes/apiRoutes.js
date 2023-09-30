const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { validateUserToken } = require('../middleware/authUserMiddleware');

/* ------------------------- Rotas para usuários ------------------------- */
// Rota para criar um novo usuário
router.post("/users", userController.createUser);

// Rota para buscar um usuário por ID (pode exigir autenticação)
router.get("/users/:id", isAuthenticated, userController.getUserById);

// Rota para atualizar um usuário por ID (pode exigir autenticação)
router.put("/users/:id", validateUserToken, userController.updateUser);

// Rota para excluir (soft delete) um usuário por ID (pode exigir autenticação)
router.delete('/users/:id', validateUserToken, userController.softDeleteUser);

// Rota para restaurar um usuário excluído por ID (pode exigir autenticação)
router.put('/users/:id/restore', validateUserToken, userController.restoreUser);

/* ------------------------- Rotas para tokens ------------------------- */
// Rota para atualizar um token pelo ID do usuário (exemplo)
router.put("/tokens/:id", validateUserToken, tokenController.updateToken);

module.exports = router;
