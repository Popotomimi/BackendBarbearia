import { Router, Request, Response } from "express";
import { createCliente, findClienteById, getAllClientes, RemoveCliente, updateCliente } from "./controllers/clienteControllers";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
    res.status(200).send("API Working!");
});

router.post("/cliente", (req: Request, res: Response) => {
    createCliente(req, res);
});

router.get("/cliente/:id", (req: Request, res: Response) => {
    findClienteById(req, res);
})

router.get("/cliente", (req: Request, res: Response) => {
    getAllClientes(req, res);
})

router.delete("/cliente/:id", (req: Request, res: Response) => {
    RemoveCliente(req, res);
})

router.patch("/cliente/:id", (req: Request, res: Response) => {
    updateCliente(req, res);
})

export default router;
