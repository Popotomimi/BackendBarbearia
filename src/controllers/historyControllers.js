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
exports.getAllHistory = getAllHistory;
exports.globalSearch = globalSearch;
const History_1 = require("../models/History");
const logger_1 = __importDefault(require("../../config/logger"));
// Função para buscar todos os clientes
function getAllHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clietes = yield History_1.HistoryModel.find();
            return res.status(200).json(clietes);
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
// Função para buscar com base em qualquer termo
function globalSearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { q } = req.query; // Parâmetro de busca (query string)
        try {
            if (!q) {
                return res
                    .status(400)
                    .json({ error: "Por favor, forneça um termo de busca." });
            }
            const searchTerm = new RegExp(q, "i"); // Regex para busca parcial e case insensitive
            // Busca nos campos relevantes
            const results = yield History_1.HistoryModel.find({
                $or: [
                    { name: { $regex: searchTerm } },
                    { barber: { $regex: searchTerm } },
                    { phone: { $regex: searchTerm } },
                ],
            });
            return res.status(200).json(results);
        }
        catch (e) {
            logger_1.default.error(`Erro no sistema: ${e.message}`);
            return res.status(500).json({ error: "Por favor, tente mais tarde!" });
        }
    });
}
