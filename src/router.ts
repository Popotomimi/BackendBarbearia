import { Router, Request, Response } from "express";
import {
  createCliente,
  getAllClientes,
  getUsuariosDoDia,
  RemoveCliente,
  updateCliente,
} from "./controllers/clienteControllers";
import { getAllHistory, globalSearch } from "./controllers/historyControllers";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.status(200).send("API Working!");
});

// Rota para buscar clientes do dia
router.get("/cliente/agendadodia", (req: Request, res: Response) => {
  getUsuariosDoDia(req, res);
});

// Rota para buscar todos os historicos
router.get("/cliente/historico/all", (req: Request, res: Response) => {
  getAllHistory(req, res);
});

// Rota de pesquisa global
router.get("/cliente/historico/search", (req: Request, res: Response) => {
  globalSearch(req, res);
});

// Rota para criar cliente
router.post("/cliente", (req: Request, res: Response) => {
  createCliente(req, res);
});

// Rota para buscar todos os clientes
router.get("/cliente", (req: Request, res: Response) => {
  getAllClientes(req, res);
});

// Rota para remover cliente
router.delete("/cliente/:id", (req: Request, res: Response) => {
  RemoveCliente(req, res);
});

// Rota para atualizar cliente
router.patch("/cliente/:id", (req: Request, res: Response) => {
  updateCliente(req, res);
});

export default router;
