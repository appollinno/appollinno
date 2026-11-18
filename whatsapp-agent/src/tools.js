// Ferramentas que o agente pode usar. Adiciona as tuas (ex.: kubectl read-only, status de pipelines, etc.).
export const tools = [
  {
    name: 'get_current_time',
    description: 'Devolve data e hora actuais num fuso horário IANA (por defeito Africa/Maputo).',
    input_schema: {
      type: 'object',
      properties: { timezone: { type: 'string', description: 'Ex.: Africa/Maputo, Europe/Lisbon' } },
    },
  },
];

const handlers = {
  async get_current_time({ timezone = 'Africa/Maputo' }) {
    try {
      return new Date().toLocaleString('pt-PT', { timeZone: timezone, dateStyle: 'full', timeStyle: 'medium' });
    } catch {
      return `Fuso horário inválido: ${timezone}`;
    }
  },
};

export async function runTool(name, input) {
  const fn = handlers[name];
  if (!fn) return { content: `Ferramenta desconhecida: ${name}`, is_error: true };
  try {
    return { content: String(await fn(input ?? {})) };
  } catch (e) {
    return { content: `Erro: ${e.message}`, is_error: true };
  }
}
