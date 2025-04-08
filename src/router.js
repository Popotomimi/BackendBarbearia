"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteControllers_1 = require("./controllers/clienteControllers");
const router = (0, express_1.Router)();
router.get("/test", (req, res) => {
    res.status(200).send("API Working!");
});
// Rota para buscar clientes do dia
router.get("/cliente/agendadodia", (req, res) => {
    (0, clienteControllers_1.getUsuariosDoDia)(req, res);
});
// Rota para criar cliente
router.post("/cliente", (req, res) => {
    (0, clienteControllers_1.createCliente)(req, res);
});
// Rota para buscar cliente por ID
router.get("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.findClienteById)(req, res);
});
// Rota para buscar todos os clientes
router.get("/cliente", (req, res) => {
    (0, clienteControllers_1.getAllClientes)(req, res);
});
// Rota para remover cliente
router.delete("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.RemoveCliente)(req, res);
});
// Rota para atualizar cliente
router.patch("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.updateCliente)(req, res);
});
exports.default = router;
