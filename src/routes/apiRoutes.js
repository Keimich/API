const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { validateUserToken } = require("../middleware/authUserMiddleware");
const { validateToken } = require("../middleware/authTokenMiddleware");

/* ------------------------- Rotas para usuários ------------------------- */
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Rotas relacionadas aos usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário.
 *     description: Use esta rota para criar um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: O nome de usuário do novo usuário.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: O email do novo usuário.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: A senha do novo usuário.
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: Sucesso. Retorna o novo usuário criado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID do novo usuário.
 *                 username:
 *                   type: string
 *                   description: O nome de usuário do novo usuário.
 *                 email:
 *                   type: string
 *                   description: O endereço de e-mail do novo usuário.
 *                 token:
 *                   type: string
 *                   description: O token de acesso do novo usuário.
 *                 refreshToken:
 *                   type: string
 *                   description: O token de atualização do novo usuário.
 *       500:
 *         description: Erro interno do servidor. Falha ao criar o usuário.
 */
router.post("/users", userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário por ID.
 *     description: Use esta rota para buscar um usuário específico pelo seu ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário que deseja buscar.
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID do usuário.
 *                 username:
 *                   type: string
 *                   description: O nome de usuário do usuário.
 *                 email:
 *                   type: string
 *                   description: O endereço de e-mail do usuário.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora de criação.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora da atualização.
 *               required:
 *                 - id
 *                 - username
 *                 - email
 *       401:
 *         description: Não autorizado. Requer autenticação.
 *       404:
 *         description: Não encontrado. O ID fornecido é inválido ou o usuário não existe.
 *     security:
 *       - bearerAuth: []
 */
router.get("/users/:id", isAuthenticated, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário por ID.
 *     description: Use esta rota para atualizar um usuário existente com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário que deseja atualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: O novo nome de usuário do usuário.
 *               email:
 *                 type: string
 *                 description: O novo endereço de e-mail do usuário.
 *               password:
 *                 type: string
 *                 description: A nova senha do usuário.
 *             required:
 *               - username
 *               - email
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o usuário atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID do usuário atualizado.
 *                 username:
 *                   type: string
 *                   description: O novo nome de usuário do usuário.
 *                 email:
 *                   type: string
 *                   description: O novo endereço de e-mail do usuário.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora da atualização.
 *       400:
 *         description: Requisição inválida. Certifique-se de fornecer dados válidos para atualização.
 *       401:
 *         description: Não autorizado. Requer autenticação.
 *       404:
 *         description: Não encontrado. O ID fornecido é inválido ou o usuário não existe.
 *       500:
 *         description: Erro interno do servidor. Falha ao atualizar o usuário.
 *     security:
 *      - bearerAuth: []
 */
router.put("/users/:id", validateUserToken, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui (soft delete) um usuário por ID.
 *     description: Use esta rota para realizar a exclusão suave de um usuário existente com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário que deseja excluir (soft delete).
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o usuário excluído (soft delete).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID do usuário excluído (soft delete).
 *                 username:
 *                   type: string
 *                   description: O nome de usuário do usuário.
 *                 email:
 *                   type: string
 *                   description: O endereço de e-mail do usuário.
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora do soft delete.
 *       400:
 *         description: Requisição inválida. Certifique-se de fornecer um ID de usuário válido.
 *       401:
 *         description: Não autorizado. Requer autenticação.
 *       404:
 *         description: Não encontrado. O ID fornecido é inválido ou o usuário não existe.
 *       500:
 *         description: Erro interno do servidor. Falha ao realizar o soft delete do usuário.
 *     security:
 *      - bearerAuth: []
 */
router.delete("/users/:id", validateUserToken, userController.softDeleteUser);

/**
 * @swagger
 * /users/{id}/restore:
 *   put:
 *     summary: Restaura um usuário excluído por ID.
 *     description: Use esta rota para restaurar um usuário excluído por soft delete com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário que deseja restaurar.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o usuário restaurado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID do usuário restaurado.
 *                 username:
 *                   type: string
 *                   description: O nome de usuário do usuário.
 *                 email:
 *                   type: string
 *                   description: O endereço de e-mail do usuário.
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora do soft delete.
 *       400:
 *         description: Requisição inválida. Certifique-se de fornecer um ID de usuário válido.
 *       401:
 *         description: Não autorizado. Requer autenticação.
 *       404:
 *         description: Não encontrado. O ID fornecido é inválido ou o usuário não existe.
 *       500:
 *         description: Erro interno do servidor. Falha ao restaurar o usuário.
 *     security:
 *      - bearerAuth: []
 */
router.put("/users/:id/restore", validateUserToken, userController.restoreUser);

/* ------------------------- Rotas para tokens ------------------------- */
/**
 * @swagger
 * tags:
 *   - name: Tokens
 *     description: Rotas relacionadas aos Tokens
 */

/**
 * @swagger
 * /tokens/{id}:
 *   put:
 *     summary: Atualiza um token pelo ID do usuário.
 *     description: Use esta rota para atualizar um token associado a um usuário pelo ID do usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário cujo token deve ser atualizado.
 *       - in: body
 *         name: body
 *         description: Objeto contendo os tokens JWT e Refresh para atualização.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             jwtToken:
 *               type: string
 *               description: O novo token JWT.
 *             refreshToken:
 *               type: string
 *               description: O novo Refresh Token.
 *     tags:
 *       - Tokens
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o token atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: O ID do usuário associado ao token.
 *                 jwtToken:
 *                   type: string
 *                   description: O token JWT atualizado.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: A data e hora da atualização do token.
 *       400:
 *         description: Requisição inválida. Certifique-se de fornecer um ID de usuário válido e os tokens corretos no corpo da requisição.
 *       401:
 *         description: Não autorizado. O token JWT fornecido é inválido.
 *       404:
 *         description: Não encontrado. O ID fornecido é inválido ou o usuário não existe.
 *       500:
 *         description: Erro interno do servidor. Falha ao atualizar o token.
 *     security:
 *      - bearerAuth: []
 */
router.put("/tokens/:id", validateToken, tokenController.updateToken);

module.exports = router;
