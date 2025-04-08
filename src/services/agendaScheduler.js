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
const logger_1 = __importDefault(require("../../config/logger"));
const schedule = require("node-schedule");
const luxon_1 = require("luxon");
function inicializarAgendador() {
    schedule.scheduleJob("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const dataAtual = luxon_1.DateTime.now().setZone("America/Sao_Paulo");
            const clientes = yield Clientes_1.ClienteModel.find();
            for (const cliente of clientes) {
                const dataAgendada = luxon_1.DateTime.fromISO(`${cliente.date}T${cliente.time}`, {
                    zone: "America/Sao_Paulo",
                });
                if (dataAgendada <= dataAtual.minus({ days: 1 })) {
                    cliente.history.push({
                        date: cliente.date,
                        service: cliente.service,
                        barber: cliente.barber,
                    });
                    yield cliente.save();
                    yield Clientes_1.ClienteModel.findByIdAndDelete(cliente._id);
                }
            }
        }
        catch (error) {
            logger_1.default.error(`Erro ao remover atendimentos antigos`);
        }
    }));
}
