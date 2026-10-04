export const isIdeaPrompt = (prompt) => /\b(ideas?|brainstorm|suggestions?|concepts?|creative|names?|ways to|options?|what else can|what can i add|how can i improve)\b/i.test(prompt);

export function answerInstructions(prompt) {
  return isIdeaPrompt(prompt)
    ? "Give a short, direct answer. Act as a practical creative partner: provide 3 distinct, tailored ideas, ranked with the strongest first. Give each a concise title and one concrete detail or first step. Skip introductions, clichés, repetition, and filler. If context is missing, make a reasonable assumption."
    : "Return the most useful correct answer to the exact question. Put the answer first, keep it short and specific, and include only essential context. Avoid filler and unsupported claims. If uncertain, say so briefly instead of guessing.";
}

export const outputLimit = (prompt) => isIdeaPrompt(prompt) ? 340 : 140;

export function cleanAnswer(answer) {
  return String(answer || "")
    .trim()
    .replace(/^(?:sure|certainly|of course)[,!:.\s]+/i, "")
    .replace(/^here(?:'s| is) (?:the )?(?:answer|response)[^:\n]*:\s*/i, "")
    .replace(/^as an ai(?: language model)?[, :]+[^\n]*\n+/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
