import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';
import { tools, runTool } from './tools.js';

const client = new Anthropic({ apiKey: config.apiKey });
const histories = new Map(); // jid -> messages[]

export function resetConversation(jid) {
  histories.delete(jid);
}

/** Corre o loop do agente (modelo -> ferramentas -> modelo) e devolve o texto final. */
export async function ask(jid, userText) {
  const history = histories.get(jid) ?? [];
  history.push({ role: 'user', content: userText });

  for (let turn = 0; turn < 8; turn++) {
    const res = await client.messages.create({
      model: config.model,
      max_tokens: 1024,
      system: config.systemPrompt,
      tools,
      messages: history,
    });
    history.push({ role: 'assistant', content: res.content });

    if (res.stop_reason !== 'tool_use') {
      const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
      // Mantém só as últimas N mensagens, começando sempre num turno 'user' de texto.
      while (history.length > config.maxHistory || (history[0] && !(history[0].role === 'user' && typeof history[0].content === 'string'))) {
        if (history.length <= 1) break;
        history.shift();
      }
      histories.set(jid, history);
      return text || '(sem resposta)';
    }

    const results = [];
    for (const block of res.content.filter((b) => b.type === 'tool_use')) {
      const r = await runTool(block.name, block.input);
      results.push({ type: 'tool_result', tool_use_id: block.id, ...r });
    }
    history.push({ role: 'user', content: results });
  }
  histories.set(jid, history);
  return 'Demorei demasiado a resolver isto. Tenta reformular.';
}
