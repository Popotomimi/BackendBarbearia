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
const luxon_1 = require("luxon");
// Função para enviar mensagens pelo WhatsApp
function enviarMensagem(telefone, mensagem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const numeroFormatado = telefone.replace("+", "");
            console.log(`Tentando enviar mensagem para ${numeroFormatado}`);
            yield client.sendMessage(`${numeroFormatado}@c.us`, mensagem);
            console.log(`Mensagem enviada para ${numeroFormatado}: ${mensagem}`);
        }
        catch (error) {
            logger_1.default.error(`Erro ao enviar mensagem para ${telefone}: ${error.message}`);
        }
    });
}
// Função para agendar mensagens com ajuste de fuso horário
function agendarMensagem(telefone, date, time, mensagem) {
    // Construir horário com luxon ajustando para o fuso horário de São Paulo
    const horarioAgendado = luxon_1.DateTime.fromISO(`${date}T${time}`, {
        zone: "America/Sao_Paulo",
    });
    // Verificar se o horário é válido
    if (!horarioAgendado.isValid) {
        console.error("Horário inválido para o agendamento:", `${date}T${time}`);
        return;
    }
    // Subtrair 15 minutos
    const horario = horarioAgendado.minus({ minutes: 15 }).toJSDate();
    console.log(`Agendamento configurado para ${telefone} às ${horario.toISOString()}`);
    // Agendar a mensagem
    schedule.scheduleJob(horario, () => {
        console.log(`Enviando mensagem agendada para ${telefone}`);
        enviarMensagem(telefone, mensagem);
    });
}
// Criar cliente
function createCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, date, time, service, barber, phone } = req.body;
        if (!name || !date || !time || !service || !barber || !phone) {
            return res
                .status(422)
                .json({ message: "Todos os campos são obrigatórios!" });
        }
        try {
            const data = req.body;
            const cliente = yield Clientes_1.ClienteModel.create(data);
            const mensagem = `Olá ${cliente.name}, está quase na hora do seu corte! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
            if (typeof cliente.phone === "string") {
                agendarMensagem(cliente.phone, cliente.date, cliente.time, mensagem);
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
