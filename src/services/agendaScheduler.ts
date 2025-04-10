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
      const clientes = await ClienteModel.find();

      for (const cliente of clientes) {
        const dataAgendada = DateTime.fromISO(`${cliente.date}`, {
          zone: "America/Sao_Paulo",
        }).startOf("day");

        // Verifica se a data atual já passou do dia agendado
        if (dataAtual > dataAgendada) {
          // Remove todos os documentos da coleção de clientes
          await ClienteModel.deleteMany({});
          Logger.info("Todos os clientes foram removidos do banco de dados.");
        }
      }
    } catch (error) {
      Logger.error(
        `Erro ao remover atendimentos fora da data agendada: ${error}`
      );
    }
  });
}
