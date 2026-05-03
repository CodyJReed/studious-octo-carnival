import { ChatOllama } from "@langchain/ollama";
import { env } from "./env";

export function makeModel() {
  return new ChatOllama({
    baseUrl: "https://ollama.com",
    model: env.OLLAMA_MODEL,
    headers: {
      Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
    },
    temperature: 0.2,
  });
}