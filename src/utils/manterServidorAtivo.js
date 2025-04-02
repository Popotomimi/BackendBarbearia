"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = manterServidorAtivo;
function manterServidorAtivo() {
    setInterval(() => {
        const agora = new Date();
        const hora = agora.getHours();
        if (hora >= 8 && hora < 22) {
            console.log("Servidor está ativo durante o período de funcionamento.");
        }
        else {
            console.log("Servidor fora do período de funcionamento.");
        }
    }, 600000); // Executa a cada 10 minutos
}
