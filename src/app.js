"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors = require("cors");
const manterServidorAtivo_1 = __importDefault(require("./utils/manterServidorAtivo"));
const app = (0, express_1.default)();
// Adicione um ponto de log para verificação
console.log("Aplicando middleware CORS");
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://meushorarios.netlify.app"],
}));
// Middleware para adicionar cabeçalhos CORS (opcional)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
// Handle preflight requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.send();
});
// JSON middleware
app.use(express_1.default.json());
// DB
const db_1 = __importDefault(require("../config/db"));
// app port
const port = config_1.default.get("port");
// Routes
const router_1 = __importDefault(require("./router"));
// Logger
const logger_1 = __importDefault(require("../config/logger"));
// Middlewares
const morgamMiddleware_1 = __importDefault(require("./middleware/morgamMiddleware"));
// Manter o servidor on
(0, manterServidorAtivo_1.default)();
app.use(morgamMiddleware_1.default);
app.use("/api/", router_1.default);
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    logger_1.default.info(`Aplicação está funcionando na porta: ${port}`);
}));
