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
            const { barber, date, startTime, endTime, motivo } = req.body;
            const newBloqueio = new Bloqueio_1.Bloqueio({
                barber,
                date,
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
