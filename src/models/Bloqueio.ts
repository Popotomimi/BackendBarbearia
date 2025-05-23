import { model, Schema } from "mongoose";

const bloquioSchema = new Schema(
  {
    barber: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    motivo: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Bloqueio = model("Bloqueio", bloquioSchema);
