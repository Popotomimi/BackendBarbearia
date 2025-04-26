import { Request, Response } from "express";
import { Bloqueio } from "../models/Bloqueio";

export async function getAllBloqueios(req: Request, res: Response) {
  try {
    const bloqueios = await Bloqueio.find();
    return res.status(200).json(bloqueios);
  } catch (error) {}
}

export async function createBloqueio(req: Request, res: Response) {
  try {
    const { barber, startDate, endDate, startTime, endTime, motivo } = req.body;

    // Verificar se endDate é anterior a startDate (caso fornecido)
    if (endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        error: "Data de fim não pode ser anterior à data de início.",
      });
    }

    const newBloqueio = new Bloqueio({
      barber,
      startDate,
      endDate,
      startTime,
      endTime,
      motivo,
    });

    await newBloqueio.save();
    return res
      .status(201)
      .json({ message: "Bloqueio Adicionado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar bloqueio" });
  }
}

export async function deleteBloqueio(req: Request, res: Response) {
  try {
    const { id } = req.params; // Obtém o ID da URL

    // Tenta encontrar e remover o bloqueio pelo ID
    const bloqueioRemovido = await Bloqueio.findByIdAndDelete(id);

    if (!bloqueioRemovido) {
      return res.status(404).json({ error: "Bloqueio não encontrado." });
    }

    return res
      .status(200)
      .json({ message: "Bloqueio excluído com sucesso!", bloqueioRemovido });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir bloqueio." });
  }
}
