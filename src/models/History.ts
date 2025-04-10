import { model, Schema } from "mongoose";

const historySchema = new Schema(
  {
    name: { type: String },
    amount: { type: Number },
    barber: { type: String },
    phone: { type: String },
    dates: [{ type: Date }],
    services: [{ type: String }],
    barbers: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const HistoryModel = model("History", historySchema);
