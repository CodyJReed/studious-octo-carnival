import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const EnvSchema = z.object({
  OLLAMA_API_KEY: z.string().min(1, "A Ollama Cloud API key is needed."),
  OLLAMA_MODEL: z.string().default("gemma3:4b"),
  PORT: z.string(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error("Error while parsing env");
}

const raw = parsed.data;

export const env = Object.freeze({
  OLLAMA_API_KEY: raw.OLLAMA_API_KEY,
  OLLAMA_MODEL: raw.OLLAMA_MODEL,
  PORT: raw.PORT,
});
