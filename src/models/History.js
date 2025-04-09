"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryModel = void 0;
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    name: { type: String },
    amount: { type: Number },
    barber: { type: String },
    phone: { type: String },
}, {
    timestamps: true,
});
exports.HistoryModel = (0, mongoose_1.model)("History", historySchema);
