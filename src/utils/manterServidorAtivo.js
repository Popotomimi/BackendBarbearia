"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = manterServidorAtivo;
let intervalo;
function manterServidorAtivo() {
    intervalo = setInterval(() => {
        const agora = new Date();
        const hora = agora.getHours();
        if (hora >= 8 && hora < 23) {
            console.log("Servidor está ativo durante o período de funcionamento.");
        }
        else {
            console.log("Servidor fora do período de funcionamento.");
            clearInterval(intervalo); // Cancela o intervalo
        }
    }, 600000); // Executa a cada 10 minutos
}
