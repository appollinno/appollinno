const list = (v) => (v ?? '').split(',').map((s) => s.replace(/\D/g, '')).filter(Boolean);

export const config = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.CLAUDE_MODEL || 'claude-sonnet-5-5',
  allowed: new Set(list(process.env.ALLOWED_NUMBERS)),
  allowGroups: process.env.ALLOW_GROUPS === 'true',
  authDir: process.env.AUTH_DIR || './auth',
  logLevel: process.env.LOG_LEVEL || 'info',
  maxHistory: 20, // mensagens por conversa
  systemPrompt: `És o assistente pessoal do Cremildo Manhique (Azure Cloud Architect / DevOps Engineer, Maputo), a responder via WhatsApp.
Responde em português (ou na língua em que te escreverem), de forma curta e directa, adequada a mensagens de telemóvel.
Podes usar as ferramentas disponíveis. Nunca inventes resultados; se não souberes, diz.
Formatação WhatsApp: *negrito*, _itálico_, \`código\`. Evita tabelas e títulos markdown.`,
};

if (!config.apiKey) {
  console.error('Falta ANTHROPIC_API_KEY (ver .env.example)');
  process.exit(1);
}
