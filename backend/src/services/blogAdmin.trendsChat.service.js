const Anthropic = require("@anthropic-ai/sdk").default;

let client = null;

const getModel = () =>
  String(process.env.ANTHROPIC_TRENDS_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6").trim();

const getClient = (apiKey) => {
  const key = String(apiKey || "").trim();
  if (!key) throw new Error("Anthropic API key not configured");
  if (!client || client._apiKey !== key) {
    client = new Anthropic({ apiKey: key });
    client._apiKey = key;
  }
  return client;
};

const getMessageText = (message) => {
  const block = message.content?.find((b) => b.type === "text");
  if (block?.text) return block.text;
  return message.content?.[0]?.text || "";
};

/**
 * Short conversational replies for editors asking what’s trending (B2B software editorial).
 * @param {{ role: string, content: string }[]} messages Anthropic-shaped turns (user/assistant), max ~12 last kept by caller
 */
async function replyTrendsChat(messages, apiKey) {
  const anthropic = getClient(apiKey);

  const system = `You are Compare Bazaar’s editorial research assistant (compare-bazaar.com — B2B software buying guides and comparisons).

Help editors discover trending blog topics and search angles. Rules:
- Plain text only (simple bullets with "- " are fine). No HTML.
- Be specific: propose concrete article titles or topic lines editors can paste into “Generate blog”.
- Mix evergreen + timely angles; mention categories when useful (CRM, HR/payroll, marketing, IT/security, etc.).
- If the user asks something unrelated to software buying/editorial topics, answer briefly then steer back to topic ideas.
- Keep replies concise unless they ask for depth — aim under ~350 words unless they ask for more.

Current date context: ${new Date().toISOString().slice(0, 10)}.`;

  const cleaned = messages
    .slice(-12)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && String(m.content || "").trim())
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).trim().slice(0, 8000),
    }));

  let start = 0;
  while (start < cleaned.length && cleaned[start].role === "assistant") start += 1;
  const normalized = cleaned.slice(start);

  if (!normalized.length || normalized[0].role !== "user") {
    throw new Error("Send at least one user message");
  }

  const response = await anthropic.messages.create({
    model: getModel(),
    max_tokens: 1400,
    system,
    messages: normalized,
  });

  const text = getMessageText(response).trim();
  if (!text) throw new Error("Empty model response");
  return { reply: text, model: getModel() };
}

module.exports = { replyTrendsChat, getModel };
