const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const Token = {
  // Função para criar um novo token
  async create(data) {
    return prisma.tokens.create({ data });
  },

  // Função para buscar um token pelo ID do usuário
  async findByUserId(userId) {
    return prisma.tokens.findUnique({
      where: {
        user_id: userId,
      },
    });
  },

  // Função para atualizar um token
  async update({ userId, jwtToken, updatedAt }) {
    return prisma.tokens.update({
      where: { user_id: userId },
      data: { jwt_token: jwtToken, updated_at: updatedAt },
    });
  },

  // Função para excluir um token pelo uuid do usuário
  async softDeleteByUserUuid(userUuid) {
    return prisma.tokens.update({
      where: { user_uuid: userUuid },
      data: {
        deleted_at: new Date(),
      },
    });
  },

  // Função para restaurar um token pelo ID do usuário
  async restoreByUserId(userId) {
    return prisma.tokens.update({
      where: {
        user_id: userId,
      },
      data: {
        updated_at: new Date(),
        deleted_at: null,
      },
    });
  },
};

module.exports = Token;
