const User = require("../models/user");
const userService = require("../services/userService");
const { generateAccessToken, generateRefreshToken } = require("../auth/auth");
const { hashPassword } = require("../auth/passwordUtils");
const tokenController = require("./tokenController");

// Controlador para criar um novo usuário
async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    user.token = generateAccessToken(user);
    user.refreshToken = generateRefreshToken(user);
    await tokenController.createToken(user);

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
async function getUserById(req, res) {
  try {
    let { id } = req.params;
    id = ~~id;

    if (typeof id != "number") {
      return res.status(404).json({ error: "Id inválido" });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    delete user.password;
    delete user.deleted_at;

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar o usuário" });
  }
}

// Controlador para atualizar um usuário
async function updateUser(req, res) {
  try {
    let { id } = req.params;
    id = ~~id;
    const { username, email, password } = req.body;

    if (typeof id != "number") {
      return res.status(404).json({ error: "Id inválido" });
    }

    const existingUser = await userService.checkUserExists(id);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = await userService.getUserById(id);

    user.username = username;
    user.email = email;
    user.updated_at = new Date();

    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }

    const updatedUser = await User.update(id, user);

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
    let { id } = req.params;
    id = ~~id;

    if (typeof id != "number") {
      return res.status(404).json({ error: "Id inválido" });
    }

    const existingUser = await userService.checkUserExists(id);

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await tokenController.softDeleteTokenByUserId(id);
    const deletedUser = await User.softDelete(id);

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

    if (typeof id != "number") {
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
  getUserById,
  updateUser,
  softDeleteUser,
  restoreUser,
};
