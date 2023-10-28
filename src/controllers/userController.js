const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");
const { generateAccessToken, generateRefreshToken } = require("../auth/auth");
const { hashPassword } = require("../auth/passwordUtils");
const tokenController = require("./tokenController");

// Controlador para criar um novo usuário
async function createUser(req, res) {
  try {
    const { name, last_name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const uuid = uuidv4();

    const user = await userService.createUser(uuid, name, last_name, email, hashedPassword);

    user.token = generateAccessToken(user);
    user.refreshToken = generateRefreshToken(user);
    await tokenService.createToken(user.uuid, user.token, user.refreshToken);

    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    delete user.deleted_at;

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o usuário" });
  }
}

// Controlador para buscar um usuário
async function getUserByUuid(req, res) {
  try {
    let { uuid } = req.params;

    const user = await userService.getUserByUuid(uuid);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    delete user.password;
    delete user.deleted_at;

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usuário" });
  }
}

// Controlador para atualizar um usuário
async function updateUser(req, res) {
  try {
    let { uuid } = req.params;
    const { name, last_name, email, password } = req.body;

    const existingUser = await userService.checkUserExists(uuid);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = await userService.getUserByUuid(uuid);

    user.name = name;
    user.last_name = last_name;
    user.email = email;
    user.updated_at = new Date();

    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }

    const updatedUser = await userService.updateUser(user);

    delete updatedUser.password;
    delete updatedUser.created_at;
    delete updatedUser.deleted_at;

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o usuário" });
  }
}

// Controlador para excluir um usuário
async function softDeleteUser(req, res) {
  try {
    let { uuid } = req.params;

    const existingUser = await userService.checkUserExists(uuid);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const deletedUser = await userService.softDeleteUserByUuid(uuid);
    await tokenService.softDeleteTokenByUserUuid(uuid);

    delete deletedUser.password;
    delete deletedUser.created_at;
    delete deletedUser.updated_at;

    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar o usuário" });
  }
}

// Controlador para restaurar um usuário
async function restoreUser(req, res) {
  try {
    let { id } = req.params;
    id = ~~id;

    if (id == 0) {
      return res.status(404).json({ error: "Id inválido" });
    }

    const existingUser = await User.findDeletedById(id);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await tokenController.restoreTokenByUserId(id);
    const restoredUser = await User.restore(id);

    delete restoredUser.password;
    delete restoredUser.created_at;
    delete restoredUser.updated_at;

    res.json(restoredUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao restaurar o usuário" });
  }
}

module.exports = {
  createUser,
  getUserByUuid,
  updateUser,
  softDeleteUser,
  restoreUser,
};
