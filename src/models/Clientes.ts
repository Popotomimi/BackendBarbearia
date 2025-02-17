import {model, Schema} from "mongoose";

const clienteSchema = new Schema(
    {
        name: {type: String},
        date: {type: String},
        time: {type: String},
        service: {type: String},
        duration: {type: Number},
        barber: {type: String}
    },
    {
        timestamps: true
    }
)

export const ClienteModel = model("Cliente", clienteSchema)