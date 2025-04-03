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
exports.default = manterServidorAtivo;
const axios_1 = __importDefault(require("axios"));
let intervalo;
function manterServidorAtivo() {
    intervalo = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const agora = new Date();
        const hora = agora.getHours();
        if (hora >= 8 && hora < 22) {
            try {
                // Faz a requisição GET para a própria aplicação
                const response = yield axios_1.default.get("https://backendbarbearia-6205.onrender.com/api/test"); // Ajuste a URL conforme necessário
                console.log("Requisição bem-sucedida:", response.data);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro:", error.message);
                }
                else {
                    console.error("Erro desconhecido:", error);
                }
            }
        }
        else {
            console.log("Fora do período de funcionamento. Cancelando intervalo.");
            clearInterval(intervalo);
        }
    }), 600000); // Executa a cada 10 minutos (600.000ms)
}
