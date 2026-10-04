import { answerInstructions, outputLimit } from "./answerStyle";

export async function askOllama(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b",
      prompt: `${answerInstructions(prompt)}\n\nQuestion: ${prompt}`,
      stream: false,
      options: { num_predict: outputLimit(prompt), temperature: 0.6 },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || (response.status === 404 ? "Install the model with: ollama pull llama3.2:3b" : `Ollama request failed (${response.status}).`));
  if (!data.response?.trim()) throw new Error("Ollama returned an empty answer.");
  return data.response.trim();
}
