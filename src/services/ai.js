import { askOllama } from "./ollama";
import { askGemini } from "./gemini";
import { askOpenAI } from "./openai";
import { askGrok } from "./grok";
import { askGroq } from "./groq";
import { answerLocally } from "./localAnswers";
import { AI_PROVIDERS, API_PROVIDERS } from "./providers";
import { cleanAnswer } from "./answerStyle";

const providers = { ollama: askOllama, gemini: askGemini, openai: askOpenAI, grok: askGrok, groq: askGroq };
const answerCache = new Map();
const speedKey = "canvas_provider_speeds";

function getProviderOrder(apiKeys = {}) {
  let speeds = {};
  try { speeds = JSON.parse(localStorage.getItem(speedKey) || "{}"); } catch {}
  return API_PROVIDERS.filter(({ id }) => apiKeys[id]?.trim())
    .sort((a, b) => (speeds[a.id] ?? Infinity) - (speeds[b.id] ?? Infinity)
      || ["groq", "gemini", "openai", "grok"].indexOf(a.id) - ["groq", "gemini", "openai", "grok"].indexOf(b.id));
}

function saveProviderSpeed(provider, duration) {
  try {
    const speeds = JSON.parse(localStorage.getItem(speedKey) || "{}");
    speeds[provider] = speeds[provider] ? speeds[provider] * 0.7 + duration * 0.3 : duration;
    localStorage.setItem(speedKey, JSON.stringify(speeds));
  } catch {}
}

export async function askAI({ provider, prompt, apiKey, apiKeys }) {
  if (!prompt?.trim()) throw new Error("Type a question first.");
  const localAnswer = answerLocally(prompt);
  if (localAnswer !== null) return { answer: localAnswer, source: "Quick maths" };
  const providersToTry = provider === "auto"
    ? getProviderOrder(apiKeys)
    : [{ id: provider, request: providers[provider], apiKey }];
  if (!providersToTry.length) throw new Error("Add at least one API key in AI settings to use Fastest (auto).");
  let lastError;
  for (const candidate of providersToTry) {
    const request = candidate.request || providers[candidate.id];
    if (!request) throw new Error("Choose a supported AI provider.");
    const key = `v2:${candidate.id}:${prompt.trim().toLowerCase().replace(/\s+/g, " ")}`;
    const cached = answerCache.get(key);
    if (cached && cached.until > Date.now()) return cached.result;
    if (cached) answerCache.delete(key);
    const started = Date.now();
    try {
      const answer = cleanAnswer(await request(prompt.trim(), candidate.apiKey || apiKeys?.[candidate.id]));
      if (!answer) throw new Error("The provider returned an empty answer.");
      const result = { answer, source: AI_PROVIDERS.find(({ id }) => id === candidate.id)?.label || candidate.id };
      saveProviderSpeed(candidate.id, Date.now() - started);
      answerCache.set(key, { result, until: Date.now() + 5 * 60 * 1000 });
      if (answerCache.size > 50) answerCache.delete(answerCache.keys().next().value);
      return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No configured provider could answer.");
}
