require("dotenv").config();

import express from "express";
import config from "config";
const cors = require("cors");

const app = express();

// Adicione um ponto de log para verificação
console.log("Aplicando middleware CORS");

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://meushorarios.netlify.app"]
}));

// Middleware para adicionar cabeçalhos CORS (opcional)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Handle preflight requests
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.send();
});

// JSON middleware
app.use(express.json());

// DB
import db from "../config/db";

// app port
const port = config.get<number>("port");

// Routes
import router from "./router";

// Logger
import Logger from "../config/logger";

// Middlewares
import morganMiddleware from "./middleware/morgamMiddleware";

app.use(morganMiddleware);

app.use("/api/", router);

app.listen(3000, async () => {
    await db();

    Logger.info(`Aplicação está funcionando na porta: ${port}`);
});
