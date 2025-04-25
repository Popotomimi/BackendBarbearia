import { model, Schema } from "mongoose";

const bloquioSchema = new Schema(
  {
    barber: { type: String },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    motivo: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Bloqueio = model("Bloqueio", bloquioSchema);
