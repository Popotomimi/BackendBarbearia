import axios from "axios";

let intervalo: NodeJS.Timeout;

export default function manterServidorAtivo() {
  intervalo = setInterval(async () => {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora >= 8 && hora < 22) {
      try {
        // Faz a requisição GET para a própria aplicação
        const response = await axios.get(
          "https://backendbarbearia-6205.onrender.com/api/test"
        ); // Ajuste a URL conforme necessário
        console.log("Requisição bem-sucedida:", response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro:", error.message);
        } else {
          console.error("Erro desconhecido:", error);
        }
      }
    } else {
      console.log("Fora do período de funcionamento. Cancelando intervalo.");
      clearInterval(intervalo);
    }
  }, 600000); // Executa a cada 10 minutos (600.000ms)
}
