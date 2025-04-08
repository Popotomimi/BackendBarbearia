import { ClienteModel } from "../models/Clientes";
import Logger from "../../config/logger";
const schedule = require("node-schedule");
import { DateTime } from "luxon";

export function inicializarAgendador() {
  schedule.scheduleJob("0 0 * * *", async () => {
    try {
      const dataAtual = DateTime.now().setZone("America/Sao_Paulo");
      const clientes = await ClienteModel.find();

      for (const cliente of clientes) {
        const dataAgendada = DateTime.fromISO(
          `${cliente.date}T${cliente.time}`,
          {
            zone: "America/Sao_Paulo",
          }
        );

        if (dataAgendada <= dataAtual.minus({ days: 1 })) {
          cliente.history.push({
            date: cliente.date,
            service: cliente.service,
            barber: cliente.barber,
          });
          await cliente.save();

          await ClienteModel.findByIdAndDelete(cliente._id);
        }
      }
    } catch (error) {
      Logger.error(`Erro ao remover atendimentos antigos`);
    }
  });
}
