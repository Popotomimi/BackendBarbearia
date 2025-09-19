import { Request, Response } from "express";
import { ClienteModel } from "../models/Clientes";
import { HistoryModel } from "../models/History";
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

// Função para enviar mensagem ao barbeiro
async function enviarMensagemBarbeiro(
  barber: string,
  cliente: any
): Promise<void> {
  try {
    // Definir o número do barbeiro com base no nome
    let telefoneBarbeiro = "";
    if (barber === "Artista do Corte") {
      telefoneBarbeiro = "+5511959533499";
    } else {
      console.error("Barbeiro não encontrado!");
      return;
    }

    // Criar a mensagem com as informações do agendamento
    const mensagem = `Novo agendamento!\nCliente: ${cliente.name}\nServiço: ${cliente.service}\nBarbeiro: ${cliente.barber}\nData: ${cliente.date}\nHorário: ${cliente.time}\nTelefone do cliente: ${cliente.phone}`;

    // Enviar a mensagem para o barbeiro
    const numeroFormatado = telefoneBarbeiro.replace("+", "");
    await client.sendMessage(`${numeroFormatado}@c.us`, mensagem);
  } catch (error: any) {
    Logger.error(
      `Erro ao enviar mensagem para o barbeiro ${barber}: ${error.message}`
    );
  }
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
    // Validar se a data e horário estão no futuro
    const dataAtual = DateTime.now().setZone("America/Sao_Paulo");
    const dataAgendada = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Sao_Paulo",
    });

    if (!dataAgendada.isValid || dataAgendada <= dataAtual) {
      return res
        .status(422)
        .json({ message: "A data e o horário devem ser no futuro!" });
    }

    // Criar o cliente
    const cliente = await ClienteModel.create({
      name,
      date,
      time,
      service,
      barber,
      phone,
    });

    // Verificar se já existe um histórico com o número de telefone fornecido
    let historyExistente = await HistoryModel.findOne({ phone });

    if (historyExistente) {
      // Incrementar o valor de amount
      historyExistente.amount = (historyExistente.amount ?? 0) + 1;

      // Adicionar a nova data, serviço e barbeiro aos arrays
      historyExistente.dates.push(dataAgendada.toJSDate());
      historyExistente.services.push(service);
      historyExistente.barbers.push(barber);
      historyExistente.times.push(time);

      await historyExistente.save();
    } else {
      // Criar novo registro no History
      await HistoryModel.create({
        name: cliente.name,
        phone: cliente.phone,
        amount: 1,
        dates: [dataAgendada.toJSDate()],
        times: [time],
        services: [service],
        barbers: [barber],
      });
    }

    // Agendar mensagem
    const mensagem = `Olá ${cliente.name}, está quase na hora! Serviço: ${cliente.service} com ${cliente.barber} às ${cliente.time}.`;
    if (
      typeof cliente.phone === "string" &&
      typeof cliente.date === "string" &&
      typeof cliente.time === "string"
    ) {
      agendarMensagem(cliente.phone, cliente.date, cliente.time, mensagem);
    } else {
      throw new Error("Dados inválidos ou ausentes.");
    }

    await enviarMensagemBarbeiro(barber, cliente);

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

// Função para buscar clientes do dia
export async function getUsuariosDoDia(req: Request, res: Response) {
  try {
    // Obter a data atual no formato "YYYY-MM-DD"
    const dataAtual = DateTime.now().setZone("America/Sao_Paulo").toISODate();

    // Buscar todos os usuários do banco de dados
    const todosUsuarios = await ClienteModel.find();

    // Filtrar os usuários com a data atual
    const usuariosDoDia = todosUsuarios.filter(
      (usuario) => usuario.date === dataAtual
    );

    // Retornar a resposta com os usuários filtrados
    return res.status(200).json(usuariosDoDia);
  } catch (error) {
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

// Função para buscar um cliente pelo ID
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

// Função para buscar todos os clientes
export async function getAllClientes(req: Request, res: Response) {
  try {
    const clietes = await ClienteModel.find();
    return res.status(200).json(clietes);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

// Função para cancelar um agendamento
function cancelarAgendamento(telefone: string): void {
  const jobs = schedule.scheduledJobs;
  for (const jobName in jobs) {
    if (jobName.includes(telefone)) {
      console.log(`Cancelando agendamento para ${telefone}`);
      jobs[jobName].cancel();
    }
  }
}

// Atualizar função RemoveCliente
export async function RemoveCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    // Cancelar agendamento associado
    if (typeof cliente.phone === "string") {
      cancelarAgendamento(cliente.phone);
    }

    await cliente.deleteOne();

    return res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

// Atualizar função updateCliente
export async function updateCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data = req.body;
    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "O Cliente não existe!" });
    }

    // Cancelar agendamento anterior
    if (typeof cliente.phone === "string") {
      cancelarAgendamento(cliente.phone);
    }

    // Atualizar cliente
    await ClienteModel.updateOne({ _id: id }, data);

    // Criar novo agendamento com informações atualizadas
    const mensagem = `Olá ${data.name}, está quase na hora! Serviço: ${data.service} com ${data.barber} às ${data.time}.`;
    if (
      typeof data.phone === "string" &&
      typeof data.date === "string" &&
      typeof data.time === "string"
    ) {
      agendarMensagem(data.phone, data.date, data.time, mensagem);
    } else {
      throw new Error("Número de telefone inválido ou ausente.");
    }

    return res
      .status(200)
      .json({ cliente: { ...cliente.toObject(), ...data } });
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}
