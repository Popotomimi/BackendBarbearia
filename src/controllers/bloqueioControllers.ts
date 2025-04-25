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
    const { barber, date, startTime, endTime, motivo } = req.body;

    const newBloqueio = new Bloqueio({
      barber,
      date,
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
