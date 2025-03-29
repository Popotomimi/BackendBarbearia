const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Configurar o cliente WhatsApp com autenticação persistente
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "barbearia-session", // Identificador único para sua sessão
  }),
});

// Gerar o QR Code para login
client.on("qr", (qr) => {
  console.log("Escaneie este QR Code no WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Cliente pronto para uso
client.on("ready", () => {
  console.log("Cliente WhatsApp está pronto!");
});

// Capturar erros do WhatsApp
client.on("error", (error) => {
  console.error("Erro no WhatsApp:", error);
});

// Desconexão do cliente
client.on("disconnected", (reason) => {
  console.log(`Cliente desconectado: ${reason}`);
});

// Inicializar o cliente WhatsApp
client.initialize();

module.exports = client; // Exporta o cliente para ser usado em outros módulos
