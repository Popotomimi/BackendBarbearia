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

        // Verifica se o cliente foi agendado para o dia atual
        if (
          dataAgendada.toFormat("yyyy-MM-dd") ===
          dataAtual.toFormat("yyyy-MM-dd")
        ) {
          await ClienteModel.findByIdAndDelete(cliente._id); // Apenas remove o cliente
        }
      }
    } catch (error) {
      Logger.error(`Erro ao remover atendimentos do dia atual`);
    }
  });
}
