export const AI_PROVIDERS = [
  { id: "auto", label: "Fastest (auto)" },
  { id: "ollama", label: "Ollama (local)" },
  { id: "gemini", label: "Gemini" },
  { id: "openai", label: "GPT" },
  { id: "grok", label: "Grok" },
  { id: "groq", label: "Groq" },
];

export const API_PROVIDERS = [
  { id: "gemini", label: "Gemini", placeholder: "Gemini API key", link: "https://aistudio.google.com/apikey" },
  { id: "openai", label: "OpenAI", placeholder: "OpenAI API key", link: "https://platform.openai.com/api-keys" },
  { id: "grok", label: "xAI / Grok", placeholder: "xAI API key", link: "https://console.x.ai/" },
  { id: "groq", label: "Groq", placeholder: "Groq API key", link: "https://console.groq.com/keys" },
];
