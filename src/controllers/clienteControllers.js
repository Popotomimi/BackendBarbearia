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
const Clientes_1 = require("../models/Clientes");
const logger_1 = __importDefault(require("../../config/logger"));
const client = require("../../config/whatsapp.js");
const schedule = require("node-schedule");
// Função para enviar mensagens pelo WhatsApp
function enviarMensagem(telefone, mensagem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.sendMessage(`${telefone}@c.us`, mensagem);
            console.log(`Mensagem enviada para ${telefone}: ${mensagem}`);
        }
        catch (error) {
            logger_1.default.error(`Erro ao enviar mensagem para ${telefone}: ${error.message}`);
        }
    });
}
// Função para agendar mensagens
function agendarMensagem(telefone, horarioAgendado, mensagem) {
    const horario = new Date(horarioAgendado);
    horario.setMinutes(horario.getMinutes() - 15); // Enviar 15 minutos antes
    schedule.scheduleJob(horario, () => {
        enviarMensagem(telefone, mensagem);
    });
}
// Criar cliente
function createCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, date, time, service, barber, phone } = req.body;
        // Validação dos campos obrigatórios
        if (!name || !date || !time || !service || !barber || !phone) {
            return res
                .status(422)
                .json({ message: "Todos os campos são obrigatórios!" });
        }
        try {
            const data = req.body;
            const cliente = yield Clientes_1.ClienteModel.create(data);
            // Mensagem personalizada para o cliente
            const mensagem = `Olá ${cliente.name}, está quase na hora do seu corte! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
            const horarioAgendado = `${cliente.date}T${cliente.time}`;
            if (typeof cliente.phone === "string") {
                agendarMensagem(cliente.phone, horarioAgendado, mensagem);
            }
            else {
                throw new Error("Número de telefone inválido ou ausente.");
            }
            return res.status(201).json(cliente);
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Erro no sistema: ${e.message}`);
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
            else {
                logger_1.default.error("Erro desconhecido!");
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
        }
    });
}
// Buscar cliente por ID
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
            if (e instanceof Error) {
                logger_1.default.error(`Erro no sistema: ${e.message}`);
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
        }
    });
}
// Listar todos os clientes
function getAllClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientes = yield Clientes_1.ClienteModel.find();
            return res.status(200).json(clientes);
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Erro no sistema: ${e.message}`);
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
        }
    });
}
// Remover cliente
function RemoveCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            yield cliente.deleteOne();
            return res.status(200).json({ message: "Cliente removido com sucesso!" });
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Erro no sistema: ${e.message}`);
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
        }
    });
}
// Atualizar cliente
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
            if (e instanceof Error) {
                logger_1.default.error(`Erro no sistema: ${e.message}`);
                return res.status(500).json({ error: "Por favor, tente mais tarde!" });
            }
        }
    });
}
