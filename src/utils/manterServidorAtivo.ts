import axios from "axios";

let intervalo: NodeJS.Timeout;

export default function manterServidorAtivo() {
  intervalo = setInterval(async () => {
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
  }, 600000); // Executa a cada 10 minutos (600.000ms)
}
