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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBloqueios = getAllBloqueios;
exports.createBloqueio = createBloqueio;
exports.deleteBloqueio = deleteBloqueio;
const Bloqueio_1 = require("../models/Bloqueio");
function getAllBloqueios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bloqueios = yield Bloqueio_1.Bloqueio.find();
            return res.status(200).json(bloqueios);
        }
        catch (error) { }
    });
}
function createBloqueio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { barber, startDate, endDate, startTime, endTime, motivo } = req.body;
            // Verificar se endDate é anterior a startDate (caso fornecido)
            if (endDate && new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({
                    error: "Data de fim não pode ser anterior à data de início.",
                });
            }
            const newBloqueio = new Bloqueio_1.Bloqueio({
                barber,
                startDate,
                endDate,
                startTime,
                endTime,
                motivo,
            });
            yield newBloqueio.save();
            return res
                .status(201)
                .json({ message: "Bloqueio Adicionado com sucesso!" });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao criar bloqueio" });
        }
    });
}
function deleteBloqueio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params; // Obtém o ID da URL
            // Tenta encontrar e remover o bloqueio pelo ID
            const bloqueioRemovido = yield Bloqueio_1.Bloqueio.findByIdAndDelete(id);
            if (!bloqueioRemovido) {
                return res.status(404).json({ error: "Bloqueio não encontrado." });
            }
            return res
                .status(200)
                .json({ message: "Bloqueio excluído com sucesso!", bloqueioRemovido });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao excluir bloqueio." });
        }
    });
}
