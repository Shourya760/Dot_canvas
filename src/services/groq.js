import { answerInstructions, outputLimit, isIdeaPrompt } from "./answerStyle";

export async function askGroq(prompt, apiKey) {
  if (!apiKey?.trim()) throw new Error("Add your Groq API key in AI settings.");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: answerInstructions(prompt) },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: outputLimit(prompt),
      reasoning_effort: isIdeaPrompt(prompt) ? "medium" : "low",
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Groq request failed (${response.status}).`);
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Groq returned an empty answer.");
  return answer;
}
