const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

// Gerar o QR Code para login
client.on("qr", (qr) => {
  console.log("Escaneie este QR Code no WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Cliente WhatsApp está pronto!");
});

client.on("error", (error) => {
  console.error("Erro no WhatsApp:", error);
});

client.initialize();

module.exports = client; // Exporta o cliente para usar em outros módulos
