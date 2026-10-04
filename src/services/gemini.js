import { answerInstructions, outputLimit } from "./answerStyle";

export async function askGemini(prompt, apiKey) {
  if (!apiKey?.trim()) throw new Error("Add your Gemini API key in AI settings.");
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey.trim() },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: answerInstructions(prompt) }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: outputLimit(prompt) },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Gemini request failed (${response.status}).`);
  const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!answer) throw new Error("Gemini returned an empty answer.");
  return answer;
}
