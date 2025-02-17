import e, {Request, Response} from "express";

// Model
import { ClienteModel } from "../models/Clientes";

// Logger
import Logger from "../../config/logger";

export async function createCliente(req: Request, res: Response) {

    const {name, date, time, service, duration, barber} = req.body;

    if(!name) {
        res.status(422).json({ message: "O nome é obirgatório!" });
        return;
    }

    if(!date) {
        res.status(422).json({ message: "Selecione a data para agendar!" });
        return;
    }

    if(!time) {
        res.status(422).json({ message: "Selecione a hora do agendamento!" });
        return;
    }
    
    if(!service) {
        res.status(422).json({ message: "Escolha o serviço!" });
        return;
    }

    if(!duration) {
        res.status(422).json({ message: "Escolha o serviço!!" });
        return;
    }

    if(!barber) {
        res.status(422).json({ message: "Escolha o Barbeiro!!" });
        return;
    }

    try {
        const data = req.body
        const cliente = await ClienteModel.create(data);
        return res.status(201).json(cliente)
    } catch (e: any) {
        Logger.error(`Erro no sistema: ${e.message}`);
        return res.status(500).json({error: "Por favor, tente mais tarde!"});
    }
}

export async function findClienteById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const cliente = await ClienteModel.findById(id);

        if(!cliente) {
            return res.status(404).json({error: "O Cliente não existe!"})
        }

        return res.status(200).json(cliente)
    } catch (e: any) {
        Logger.error(`Erro no sistema: ${e.message}`);
        return res.status(500).json({error: "Por favor, tente mais tarde!"});
    }
}

export async function getAllClientes(req: Request, res: Response) {
    try {
        
        const clietes = await ClienteModel.find()
        return res.status(200).json(clietes);

    } catch (e: any) {
        Logger.error(`Erro no sistema: ${e.message}`);
        return res.status(500).json({error: "Por favor, tente mais tarde!"});
    }
}

export async function RemoveCliente(req: Request, res: Response) {
    try {
        
        const id = req.params.id;
        const cliente = await ClienteModel.findById(id);

        if(!cliente) {
            return res.status(404).json({error: "O Cliente não existe!"});
        }

        await cliente.deleteOne();

        return res.status(200).json({ message: "Cliente removido som sucesso!"});

    } catch (e: any) {
        Logger.error(`Erro no sistema: ${e.message}`);
        return res.status(500).json({error: "Por favor, tente mais tarde!"});
    }
}

export async function updateCliente(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const data = req.body;
        const cliente = await ClienteModel.findById(id);

        if(!cliente) {
            return res.status(404).json({error: "O Cliente não existe!"});
        }

        await ClienteModel.updateOne({_id: id}, data);

        return res.status(200).json({ cliente});

    } catch (e: any) {
        Logger.error(`Erro no sistema: ${e.message}`);
        return res.status(500).json({error: "Por favor, tente mais tarde!"});
    }
}