import { Request, Response } from "express";
import { ClienteModel } from "../models/Clientes";
import Logger from "../../config/logger";
const client = require("../../config/whatsapp.js");
const schedule = require("node-schedule");
import { DateTime } from "luxon";

// Função para enviar mensagens pelo WhatsApp
async function enviarMensagem(
  telefone: string,
  mensagem: string
): Promise<void> {
  try {
    const numeroFormatado = telefone.replace("+", "");
    console.log(`Tentando enviar mensagem para ${numeroFormatado}`);
    await client.sendMessage(`${numeroFormatado}@c.us`, mensagem);
    console.log(`Mensagem enviada para ${numeroFormatado}: ${mensagem}`);
  } catch (error: any) {
    Logger.error(`Erro ao enviar mensagem para ${telefone}: ${error.message}`);
  }
}

// Função para agendar mensagens com ajuste de fuso horário
function agendarMensagem(
  telefone: string,
  date: string,
  time: string,
  mensagem: string
): void {
  // Construir horário com luxon ajustando para o fuso horário de São Paulo
  const horarioAgendado = DateTime.fromISO(`${date}T${time}`, {
    zone: "America/Sao_Paulo",
  });

  // Verificar se o horário é válido
  if (!horarioAgendado.isValid) {
    console.error("Horário inválido para o agendamento:", `${date}T${time}`);
    return;
  }

  // Subtrair 15 minutos
  const horario = horarioAgendado.minus({ minutes: 15 }).toJSDate();

  console.log(
    `Agendamento configurado para ${telefone} às ${horario.toISOString()}`
  );
  
  // Agendar a mensagem
  schedule.scheduleJob(horario, () => {
    console.log(`Enviando mensagem agendada para ${telefone}`);
    enviarMensagem(telefone, mensagem);
  });
}

// Criar cliente
export async function createCliente(req: Request, res: Response) {
  const { name, date, time, service, barber, phone } = req.body;

  if (!name || !date || !time || !service || !barber || !phone) {
    return res
      .status(422)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const data = req.body;
    const cliente = await ClienteModel.create(data);

    const mensagem = `Olá ${cliente.name}, está quase na hora! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
    if (
      typeof cliente.phone === "string" &&
      typeof cliente.date === "string" &&
      typeof cliente.time === "string"
    ) {
      agendarMensagem(cliente.phone, cliente.date, cliente.time, mensagem);
    } else {
      throw new Error("Número de telefone inválido ou ausente.");
    }

    return res.status(201).json(cliente);
  } catch (e: unknown) {
    if (e instanceof Error) {
      Logger.error(`Erro no sistema: ${e.message}`);
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    } else {
      Logger.error("Erro desconhecido!");
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    }
  }
}

export async function findClienteById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    return res.status(200).json(cliente);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

export async function getAllClientes(req: Request, res: Response) {
  try {
    const clietes = await ClienteModel.find();
    return res.status(200).json(clietes);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

export async function RemoveCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    await cliente.deleteOne();

    return res.status(200).json({ message: "Cliente removido som sucesso!" });
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

export async function updateCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data = req.body;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    await ClienteModel.updateOne({ _id: id }, data);

    return res.status(200).json({ cliente });
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}
