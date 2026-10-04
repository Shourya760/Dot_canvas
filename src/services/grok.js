import { answerInstructions, outputLimit } from "./answerStyle";

export async function askGrok(prompt, apiKey) {
  if (!apiKey?.trim()) throw new Error("Add your xAI API key in AI settings.");
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
    body: JSON.stringify({
      model: "grok-4.7",
      messages: [
        { role: "system", content: answerInstructions(prompt) },
        { role: "user", content: prompt },
      ],
      max_tokens: outputLimit(prompt),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Grok request failed (${response.status}).`);
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Grok returned an empty answer.");
  return answer;
}
