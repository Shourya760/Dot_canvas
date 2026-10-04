import { answerInstructions, outputLimit, isIdeaPrompt } from "./answerStyle";

export async function askOpenAI(prompt, apiKey) {
  if (!apiKey?.trim()) throw new Error("Add your OpenAI API key in AI settings.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      instructions: answerInstructions(prompt),
      input: prompt,
      reasoning: { effort: isIdeaPrompt(prompt) ? "low" : "none" },
      max_output_tokens: outputLimit(prompt),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `OpenAI request failed (${response.status}).`);
  const answer = data.output?.flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("").trim();
  if (!answer) throw new Error("OpenAI returned an empty answer.");
  return answer;
}
