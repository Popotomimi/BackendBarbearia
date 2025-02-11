"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteControllers_1 = require("./controllers/clienteControllers");
const router = (0, express_1.Router)();
router.get("/test", (req, res) => {
    res.status(200).send("API Working!");
});
router.post("/cliente", (req, res) => {
    (0, clienteControllers_1.createCliente)(req, res);
});
router.get("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.findClienteById)(req, res);
});
router.get("/cliente", (req, res) => {
    (0, clienteControllers_1.getAllClientes)(req, res);
});
router.delete("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.RemoveCliente)(req, res);
});
router.patch("/cliente/:id", (req, res) => {
    (0, clienteControllers_1.updateCliente)(req, res);
});
exports.default = router;
