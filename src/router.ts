import { Router, Request, Response } from "express";
import {
  createCliente,
  getAllClientes,
  getUsuariosDoDia,
  RemoveCliente,
  updateCliente,
} from "./controllers/clienteControllers";
import {
  getAllHistory,
  getHistoryById,
  globalSearch,
} from "./controllers/historyControllers";
import {
  createBloqueio,
  deleteBloqueio,
  getAllBloqueios,
} from "./controllers/bloqueioControllers";

const router = Router();

// Manter SErvidor online
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

// Rota para buscar bloqueios
router.get("/cliente/bloqueios", (req: Request, res: Response) => {
  getAllBloqueios(req, res);
});

// Rota para Adicionar bloqueios
router.post("/cliente/bloqueios", (req: Request, res: Response) => {
  createBloqueio(req, res);
});

// Rota para remover bloqueios
router.delete("/cliente/bloqueios/:id", (req: Request, res: Response) => {
  deleteBloqueio(req, res);
});

// Rota para remover cliente
router.delete("/cliente/:id", (req: Request, res: Response) => {
  RemoveCliente(req, res);
});

// Rota para atualizar cliente
router.patch("/cliente/:id", (req: Request, res: Response) => {
  updateCliente(req, res);
});

// Rota para buscar histórico por ID
router.get("/cliente/historico/:id", (req: Request, res: Response) => {
  getHistoryById(req, res);
});

export default router;
