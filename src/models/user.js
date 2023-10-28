const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const User = {
  // Função para buscar um usuário por ID
  async findByUuid(uuid) {
    return prisma.users.findUnique({
      where: {
        uuid: uuid,
        deleted_at: null,
      },
    });
  },

  // Função para buscar um usuário por nome de usuário
  async findByUsername(username) {
    return prisma.users.findUnique({
      where: { username },
    });
  },

  // Função para criar um novo usuário
  async create(data) {
    return prisma.users.create({
      data,
    });
  },

  // Função para atualizar um usuário
  async update(uuid, user) {
    return prisma.users.update({
      where: { uuid: uuid },
      data: user
    });
  },

  // Função para excluir (soft delete) um usuário
  async softDelete(id) {
    return prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  },

  // Função para buscar um usuário deletado por ID
  async findDeletedById(id) {
    return prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  },

  // Função para restaurar um usuário
  async restore(id) {
    return prisma.users.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });
  },
};

module.exports = User;
