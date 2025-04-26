import { ClienteModel } from "../models/Clientes";
import { Bloqueio } from "../models/Bloqueio";
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

      // 1. Remover clientes cuja data agendada já passou
      const diaAnterior = dataAtual.minus({ days: 1 });
      const clientes = await ClienteModel.find();

      for (const cliente of clientes) {
        const dataAgendada = DateTime.fromISO(`${cliente.date}`, {
          zone: "America/Sao_Paulo",
        }).startOf("day");

        if (dataAgendada.equals(diaAnterior)) {
          await ClienteModel.deleteOne({ _id: cliente._id });
          Logger.info(`Cliente com ID ${cliente._id} foi removido.`);
        }
      }

      // 2. Remover bloqueios cuja data já passou
      const bloqueios = await Bloqueio.find();

      for (const bloqueio of bloqueios) {
        const dataFinal = bloqueio.endDate
          ? DateTime.fromISO(`${bloqueio.endDate}`, {
              zone: "America/Sao_Paulo",
            }).startOf("day")
          : DateTime.fromISO(`${bloqueio.startDate}`, {
              zone: "America/Sao_Paulo",
            }).startOf("day");

        if (dataFinal < dataAtual) {
          await Bloqueio.deleteOne({ _id: bloqueio._id });
          Logger.info(`Bloqueio com ID ${bloqueio._id} foi removido.`);
        }
      }
    } catch (error) {
      Logger.error(`Erro ao executar o agendador: ${error}`);
    }
  });
}
