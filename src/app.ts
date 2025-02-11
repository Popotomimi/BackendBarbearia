require("dotenv").config();

import express from "express";
import config from "config";
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*" // Permite qualquer origem
}));

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
