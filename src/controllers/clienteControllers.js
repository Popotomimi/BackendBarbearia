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
exports.getUsuariosDoDia = getUsuariosDoDia;
exports.findClienteById = findClienteById;
exports.getAllClientes = getAllClientes;
exports.RemoveCliente = RemoveCliente;
exports.updateCliente = updateCliente;
const Clientes_1 = require("../models/Clientes");
const History_1 = require("../models/History");
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
        var _a;
        const { name, date, time, service, barber, phone } = req.body;
        if (!name || !date || !time || !service || !barber || !phone) {
            return res
                .status(422)
                .json({ message: "Todos os campos são obrigatórios!" });
        }
        try {
            // Validar se a data e horário estão no futuro
            const dataAtual = luxon_1.DateTime.now().setZone("America/Sao_Paulo");
            const dataAgendada = luxon_1.DateTime.fromISO(`${date}T${time}`, {
                zone: "America/Sao_Paulo",
            });
            if (!dataAgendada.isValid || dataAgendada <= dataAtual) {
                return res
                    .status(422)
                    .json({ message: "A data e o horário devem ser no futuro!" });
            }
            // Criar o cliente
            const cliente = yield Clientes_1.ClienteModel.create({
                name,
                date,
                time,
                service,
                barber,
                phone,
            });
            // Verificar se já existe um histórico com o número de telefone fornecido
            let historyExistente = yield History_1.HistoryModel.findOne({ phone });
            if (historyExistente) {
                // Incrementar o valor de amount
                historyExistente.amount = ((_a = historyExistente.amount) !== null && _a !== void 0 ? _a : 0) + 1;
                // Adicionar a nova data, serviço e barbeiro aos arrays
                historyExistente.dates.push(dataAgendada.toJSDate());
                historyExistente.services.push(service);
                historyExistente.barbers.push(barber);
                yield historyExistente.save();
            }
            else {
                // Criar novo registro no History
                yield History_1.HistoryModel.create({
                    name: cliente.name,
                    phone: cliente.phone,
                    amount: 1,
                    dates: [dataAgendada.toJSDate()],
                    services: [service],
                    barbers: [barber],
                });
            }
            // Agendar mensagem
            const mensagem = `Olá ${cliente.name}, está quase na hora! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
            if (typeof cliente.phone === "string" &&
                typeof cliente.date === "string" &&
                typeof cliente.time === "string") {
                agendarMensagem(cliente.phone, cliente.date, cliente.time, mensagem);
            }
            else {
                throw new Error("Dados inválidos ou ausentes.");
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
// Função para buscar clientes do dia
function getUsuariosDoDia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obter a data atual no formato "YYYY-MM-DD"
            const dataAtual = luxon_1.DateTime.now().setZone("America/Sao_Paulo").toISODate();
            // Buscar todos os usuários do banco de dados
            const todosUsuarios = yield Clientes_1.ClienteModel.find();
            // Filtrar os usuários com a data atual
            const usuariosDoDia = todosUsuarios.filter((usuario) => usuario.date === dataAtual);
            // Retornar a resposta com os usuários filtrados
            return res.status(200).json(usuariosDoDia);
        }
        catch (error) {
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
// Função para buscar um cliente pelo ID
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
// Função para buscar todos os clientes
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
// Função para cancelar um agendamento
function cancelarAgendamento(telefone) {
    const jobs = schedule.scheduledJobs;
    for (const jobName in jobs) {
        if (jobName.includes(telefone)) {
            console.log(`Cancelando agendamento para ${telefone}`);
            jobs[jobName].cancel();
        }
    }
}
// Atualizar função RemoveCliente
function RemoveCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            // Cancelar agendamento associado
            if (typeof cliente.phone === "string") {
                cancelarAgendamento(cliente.phone);
            }
            yield cliente.deleteOne();
            return res.status(200).json({ message: "Cliente removido com sucesso!" });
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
// Atualizar função updateCliente
function updateCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = req.body;
            const cliente = yield Clientes_1.ClienteModel.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "O Cliente não existe!" });
            }
            // Cancelar agendamento anterior
            if (typeof cliente.phone === "string") {
                cancelarAgendamento(cliente.phone);
            }
            // Atualizar cliente
            yield Clientes_1.ClienteModel.updateOne({ _id: id }, data);
            // Criar novo agendamento com informações atualizadas
            const mensagem = `Olá ${data.name}, está quase na hora! Serviço: ${data.service} com ${data.barber} às ${data.time}.`;
            if (typeof data.phone === "string" &&
                typeof data.date === "string" &&
                typeof data.time === "string") {
                agendarMensagem(data.phone, data.date, data.time, mensagem);
            }
            else {
                throw new Error("Número de telefone inválido ou ausente.");
            }
            return res
                .status(200)
                .json({ cliente: Object.assign(Object.assign({}, cliente.toObject()), data) });
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
