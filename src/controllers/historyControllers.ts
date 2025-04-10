import { Request, Response } from "express";
import { HistoryModel } from "../models/History";
import Logger from "../../config/logger";

// Função para buscar todos os clientes
export async function getAllHistory(req: Request, res: Response) {
  try {
    const clietes = await HistoryModel.find();
    return res.status(200).json(clietes);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}

// Função para buscar com base em qualquer termo
export async function globalSearch(req: Request, res: Response) {
  const { q } = req.query; // Parâmetro de busca (query string)

  try {
    if (!q) {
      return res
        .status(400)
        .json({ error: "Por favor, forneça um termo de busca." });
    }

    const searchTerm = new RegExp(q as string, "i"); // Regex para busca parcial e case insensitive

    // Busca nos campos relevantes
    const results = await HistoryModel.find({
      $or: [
        { name: { $regex: searchTerm } },
        { barber: { $regex: searchTerm } },
        { phone: { $regex: searchTerm } },
      ],
    });

    return res.status(200).json(results);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ error: "Por favor, tente mais tarde!" });
  }
}
