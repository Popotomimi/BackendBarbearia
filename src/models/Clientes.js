"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = void 0;
const mongoose_1 = require("mongoose");
const clienteSchema = new mongoose_1.Schema({
    name: { type: String },
    date: { type: String },
    time: { type: String },
    service: { type: String },
    duration: { type: Number },
    barber: { type: String },
    phone: { type: String },
    history: [
        {
            date: { type: String },
            service: { type: String },
            barber: { type: String },
        },
    ],
}, {
    timestamps: true,
});
exports.ClienteModel = (0, mongoose_1.model)("Cliente", clienteSchema);
