"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteControllers_1 = require("./controllers/clienteControllers");
const historyControllers_1 = require("./controllers/historyControllers");
const bloqueioControllers_1 = require("./controllers/bloqueioControllers");
const router = (0, express_1.Router)();
// Manter SErvidor online
router.get("/test", (req, res) => {
    res.status(200).send("API Working!");
});
// Rota para buscar clientes do dia
router.get("/cliente/agendadodia", (req, res) => {
    (0, clienteControllers_1.getUsuariosDoDia)(req, res);
});
// Rota para buscar todos os historicos
router.get("/cliente/historico/all", (req, res) => {
    (0, historyControllers_1.getAllHistory)(req, res);
});
// Rota de pesquisa global
router.get("/cliente/historico/search", (req, res) => {
    (0, historyControllers_1.globalSearch)(req, res);
});
// Rota para criar cliente
router.post("/cliente", (req, res) => {
    (0, clienteControllers_1.createCliente)(req, res);
});
// Rota para buscar todos os clientes
router.get("/cliente", (req, res) => {
    (0, clienteControllers_1.getAllClientes)(req, res);
});
// Rota para buscar bloqueios
router.get("/cliente/bloqueios", (req, res) => {
    (0, bloqueioControllers_1.getAllBloqueios)(req, res);
});
// Rota para Adicionar bloqueios
router.post("/cliente/bloqueios", (req, res) => {
    (0, bloqueioControllers_1.createBloqueio)(req, res);
});
// Rota para remover cliente
router.delete("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.RemoveCliente)(req, res);
});
// Rota para atualizar cliente
router.patch("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.updateCliente)(req, res);
});
// Rota para buscar histórico por ID
router.get("/cliente/historico/:id", (req, res) => {
    (0, historyControllers_1.getHistoryById)(req, res);
});
exports.default = router;
