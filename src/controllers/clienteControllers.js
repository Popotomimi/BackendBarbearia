"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCliente = createCliente;
exports.findClienteById = findClienteById;
exports.getAllClientes = getAllClientes;
exports.RemoveCliente = RemoveCliente;
exports.updateCliente = updateCliente;
// Model
const Clientes_1 = require("../models/Clientes");
// Logger
const logger_1 = __importDefault(require("../../config/logger"));
function createCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, date, time, service, duration } = req.body;
        if (!name) {
            res.status(422).json({ message: "O nome é obirgatório!" });
            return;
        }
        if (!date) {
            res.status(422).json({ message: "Selecione a data para agendar!" });
            return;
        }
        if (!time) {
            res.status(422).json({ message: "Selecione a hora do agendamento!" });
            return;
        }
        if (!service) {
            res.status(422).json({ message: "Escolha o serviço!" });
            return;
        }
        if (!duration) {
            res.status(422).json({ message: "Escolha o serviço!!" });
            return;
        }
        try {
            const data = req.body;
            const cliente = yield Clientes_1.ClienteModel.create(data);
            return res.status(201).json(cliente);
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
function findClienteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            return res.status(200).json(cliente);
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
function getAllClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clietes = yield Clientes_1.ClienteModel.find();
            return res.status(200).json(clietes);
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
function RemoveCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            yield cliente.deleteOne();
            return res.status(200).json({ message: "Cliente removido som sucesso!" });
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
function updateCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = req.body;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            yield Clientes_1.ClienteModel.updateOne({ _id: id }, data);
            return res.status(200).json({ cliente });
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
