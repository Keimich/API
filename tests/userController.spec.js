const request = require("supertest");
const app = require("../src/index");
const userService = require("../src/services/userService");
const tokenService = require("../src/services/tokenService");
const { generateAccessToken } = require("../src/auth/auth");

const user = {
  id: 1,
  username: "usuario123",
  email: "usuario@example.com",
  password: "Senha123!",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

const newUser = {
  id: 1,
  username: "novousuario",
  email: "novoemail@example.com",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-02T01:02:03Z",
};

const deletedUser = {
  id: 1,
  username: "usuario123",
  email: "usuario@example.com",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  deleted_at: "2023-10-14T14:14:26.000Z",
};

const token = generateAccessToken(user);

describe("POST /users", () => {
  it("deve criar um novo usuário com sucesso", async () => {
    userService.createUser = jest.fn().mockResolvedValue(user);
    tokenService.createToken = jest.fn().mockResolvedValue(true);

    const response = await request(app).post("/api/users").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(user);
  });

  it("deve retornar um erro 500 em caso de erro no servidor", async () => {
    userService.createUser = jest.fn().mockRejectedValue(new Error("Erro ao criar o usuário"));

    const response = await request(app).post("/api/users").send(user);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro ao criar o usuário" });
  });
});

describe("GET /users/:id", () => {
  it("deve retornar um usuário válido quando um ID válido é fornecido", async () => {
    userService.getUserById = jest.fn().mockResolvedValue(user);

    const response = await request(app).get("/api/users/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  it("deve retornar um erro 404 quando um ID inválido é fornecido", async () => {
    userService.getUserById = jest.fn().mockResolvedValue(null);

    const response = await request(app).get("/api/users/invalidID").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Id inválido" });
  });

  it("deve retornar um erro 404 quando o usuário não é encontrado", async () => {
    userService.getUserById = jest.fn().mockResolvedValue(null);

    const response = await request(app).get("/api/users/666").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Usuário não encontrado" });
  });

  it("deve retornar um erro 500 em caso de erro no servidor", async () => {
    userService.getUserById = jest.fn().mockRejectedValue(new Error("Erro ao buscar o usuário"));

    const response = await request(app).get("/api/users/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro ao buscar o usuário" });
  });
});

describe("PUT /users/:id", () => {
  it("deve atualizar um usuário com sucesso", async () => {
    userService.checkUserExists = jest.fn().mockResolvedValue(true);

    userService.getUserById = jest.fn().mockResolvedValue(user);

    userService.updateUser = jest.fn().mockResolvedValue(newUser);

    const updatedData = {
      username: "novousuario",
      email: "novoemail@example.com",
      password: "novasenha",
    };

    const response = await request(app).put("/api/users/1").send(updatedData).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newUser);
  });

  it("deve retornar erro 404 quando o ID não existe", async () => {
    userService.checkUserExists = jest.fn().mockResolvedValue(false);

    const updatedData = {
      username: "novousuario",
      email: "novoemail@example.com",
      password: "novasenha",
    };

    const response = await request(app).put("/api/users/1").send(updatedData).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Usuário não encontrado" });
  });

  it("deve retornar erro 500 em caso de erro no servidor", async () => {
    userService.checkUserExists = jest.fn().mockRejectedValue(new Error("Erro ao atualizar o usuário"));

    const updatedData = {
      username: "novousuario",
      email: "novoemail@example.com",
      password: "novasenha",
    };

    const response = await request(app).put("/api/users/1").send(updatedData).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro ao atualizar o usuário" });
  });
});

describe("DELETE /users/:id", () => {
  it("deve excluir (soft delete) um usuário por ID", async () => {
    userService.checkUserExists = jest.fn().mockResolvedValue(true);

    tokenService.softDeleteTokenByUserId = jest.fn().mockResolvedValue(true);

    userService.softDeleteUserById = jest.fn().mockResolvedValue(deletedUser);

    const response = await request(app).delete("/api/users/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(deletedUser);
  });

  it("deve retornar um erro 404 quando o usuário não é encontrado", async () => {
    userService.checkUserExists = jest.fn().mockResolvedValue(false);

    const response = await request(app).delete("/api/users/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Usuário não encontrado" });
  });

  it("deve retornar um erro 500 em caso de erro no servidor", async () => {
    userService.checkUserExists = jest.fn().mockResolvedValue(true);
    userService.softDeleteUserById = jest.fn().mockRejectedValue(new Error("Erro ao deletar o usuário"));

    const response = await request(app).delete("/api/users/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro ao deletar o usuário" });
  });
});
