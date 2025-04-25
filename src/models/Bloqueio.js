"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bloqueio = void 0;
const mongoose_1 = require("mongoose");
const bloquioSchema = new mongoose_1.Schema({
    barber: { type: String },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    motivo: { type: String },
}, {
    timestamps: true,
});
exports.Bloqueio = (0, mongoose_1.model)("Bloqueio", bloquioSchema);
