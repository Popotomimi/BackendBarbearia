import { ClienteModel } from "../models/Clientes";
import Logger from "../../config/logger";
const schedule = require("node-schedule");
import { DateTime } from "luxon";

export function inicializarAgendador() {
  // Executa o job a cada hora para verificar
  schedule.scheduleJob("0 * * * *", async () => {
    try {
      const dataAtual = DateTime.now()
        .setZone("America/Sao_Paulo")
        .startOf("day");

      // Calcula a data do dia anterior
      const diaAnterior = dataAtual.minus({ days: 1 });

      const clientes = await ClienteModel.find();

      for (const cliente of clientes) {
        const dataAgendada = DateTime.fromISO(`${cliente.date}`, {
          zone: "America/Sao_Paulo",
        }).startOf("day");

        // Verifica se a data agendada é igual ao dia anterior
        if (dataAgendada.equals(diaAnterior)) {
          // Remove o cliente cuja data agendada seja do dia anterior
          await ClienteModel.deleteOne({ _id: cliente._id });
          Logger.info(`Cliente com ID ${cliente._id} foi removido.`);
        }
      }
    } catch (error) {
      Logger.error(`Erro ao remover atendimentos do dia anterior: ${error}`);
    }
  });
}
