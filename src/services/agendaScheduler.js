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
exports.inicializarAgendador = inicializarAgendador;
const Clientes_1 = require("../models/Clientes");
const Bloqueio_1 = require("../models/Bloqueio");
const logger_1 = __importDefault(require("../../config/logger"));
const schedule = require("node-schedule");
const luxon_1 = require("luxon");
function inicializarAgendador() {
    // Executa o job a cada hora para verificar
    schedule.scheduleJob("0 * * * *", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const dataAtual = luxon_1.DateTime.now()
                .setZone("America/Sao_Paulo")
                .startOf("day");
            // 1. Remover clientes cuja data agendada já passou
            const diaAnterior = dataAtual.minus({ days: 1 });
            const clientes = yield Clientes_1.ClienteModel.find();
            for (const cliente of clientes) {
                const dataAgendada = luxon_1.DateTime.fromISO(`${cliente.date}`, {
                    zone: "America/Sao_Paulo",
                }).startOf("day");
                if (dataAgendada.equals(diaAnterior)) {
                    yield Clientes_1.ClienteModel.deleteOne({ _id: cliente._id });
                    logger_1.default.info(`Cliente com ID ${cliente._id} foi removido.`);
                }
            }
            // 2. Remover bloqueios cuja data já passou
            const bloqueios = yield Bloqueio_1.Bloqueio.find();
            for (const bloqueio of bloqueios) {
                const dataFinal = bloqueio.endDate
                    ? luxon_1.DateTime.fromISO(`${bloqueio.endDate}`, {
                        zone: "America/Sao_Paulo",
                    }).startOf("day")
                    : luxon_1.DateTime.fromISO(`${bloqueio.startDate}`, {
                        zone: "America/Sao_Paulo",
                    }).startOf("day");
                if (dataFinal < dataAtual) {
                    yield Bloqueio_1.Bloqueio.deleteOne({ _id: bloqueio._id });
                    logger_1.default.info(`Bloqueio com ID ${bloqueio._id} foi removido.`);
                }
            }
        }
        catch (error) {
            logger_1.default.error(`Erro ao executar o agendador: ${error}`);
        }
    }));
}
