import { Request, Response } from "express";
import { ClienteModel } from "../models/Clientes";
import Logger from "../../config/logger";
const client = require("../../config/whatsapp.js");
const schedule = require("node-schedule");

// Função para enviar mensagens pelo WhatsApp
async function enviarMensagem(
  telefone: string,
  mensagem: string
): Promise<void> {
  try {
    await client.sendMessage(`${telefone}@c.us`, mensagem);
    console.log(`Mensagem enviada para ${telefone}: ${mensagem}`);
  } catch (error: any) {
    Logger.error(`Erro ao enviar mensagem para ${telefone}: ${error.message}`);
  }
}

// Função para agendar mensagens
function agendarMensagem(
  telefone: string,
  horarioAgendado: string,
  mensagem: string
): void {
  const horario = new Date(horarioAgendado);
  horario.setMinutes(horario.getMinutes() - 15); // Enviar 15 minutos antes
  schedule.scheduleJob(horario, () => {
    enviarMensagem(telefone, mensagem);
  });
}

// Criar cliente
export async function createCliente(req: Request, res: Response) {
  const { name, date, time, service, barber, phone } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !date || !time || !service || !barber || !phone) {
    return res
      .status(422)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const data = req.body;
    const cliente = await ClienteModel.create(data);

    // Mensagem personalizada para o cliente
    const mensagem = `Olá ${cliente.name}, está quase na hora do seu corte! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
    const horarioAgendado = `${cliente.date}T${cliente.time}`;

    if (typeof cliente.phone === "string") {
      agendarMensagem(cliente.phone, horarioAgendado, mensagem);
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

// Buscar cliente por ID
export async function findClienteById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    return res.status(200).json(cliente);
  } catch (e: unknown) {
    if (e instanceof Error) {
      Logger.error(`Erro no sistema: ${e.message}`);
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    }
  }
}

// Listar todos os clientes
export async function getAllClientes(req: Request, res: Response) {
  try {
    const clientes = await ClienteModel.find();
    return res.status(200).json(clientes);
  } catch (e: unknown) {
    if (e instanceof Error) {
      Logger.error(`Erro no sistema: ${e.message}`);
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    }
  }
}

// Remover cliente
export async function RemoveCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    await cliente.deleteOne();

    return res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (e: unknown) {
    if (e instanceof Error) {
      Logger.error(`Erro no sistema: ${e.message}`);
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    }
  }
}

// Atualizar cliente
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
  } catch (e: unknown) {
    if (e instanceof Error) {
      Logger.error(`Erro no sistema: ${e.message}`);
      return res.status(500).json({ error: "Por favor, tente mais tarde!" });
    }
  }
}
