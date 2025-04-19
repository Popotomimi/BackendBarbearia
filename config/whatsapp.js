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
  client.initialize(); // Reinicializa o cliente em caso de desconexão
});

// Adicionar funcionalidade de mensagens automáticas relacionadas a agendamentos
client.on("message", (message) => {
  if (message.body.toLowerCase().includes("agendamento")) {
    // Determina a saudação com base no horário
    const horaAtual = new Date().getHours();
    let saudacao = "Bom dia";
    if (horaAtual >= 12 && horaAtual < 18) {
      saudacao = "Boa tarde";
    } else if (horaAtual >= 18) {
      saudacao = "Boa noite";
    }

    // Envia a mensagem inicial
    message.reply(
      `${saudacao}! Como posso te ajudar?\n\nDigite:\n1 - Para fazer um agendamento\n2 - Para cancelar um agendamento`
    );
  }

  // Trata as respostas "1" ou "2"
  if (message.body === "1") {
    message.reply(
      "Aqui está o link para você fazer o agendamento: https://meushorarios.netlify.app/"
    );
  } else if (message.body === "2") {
    message.reply(
      "Por favor, entre em contato diretamente com nossos barbeiros para solicitar o cancelamento:\n- Barbeiro Gui: +55 11 98546-5474\n- Barbeiro Gabriel: +55 11 97656-0378"
    );
  }
});

// Inicializar o cliente WhatsApp
client.initialize();

module.exports = client; // Exporta o cliente para ser usado em outros módulos
