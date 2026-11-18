# WhatsApp Agent (Claude + Baileys)

Agente de IA ligado ao teu WhatsApp como "dispositivo associado" (QR code). Responde às mensagens dos números autorizados usando Claude, com suporte a ferramentas (tool use) e memória curta por conversa.

## Correr

```bash
cp .env.example .env   # preenche ANTHROPIC_API_KEY e ALLOWED_NUMBERS
npm install && npm start
```
Escaneia o QR: WhatsApp > Definições > Dispositivos associados > Associar dispositivo.
A sessão fica em `auth/` (não a commits!).

Docker: `docker compose up -d --build && docker compose logs -f`

## Uso
- Escreve para o teu próprio número ("Mensagem a ti próprio") ou deixa um número de `ALLOWED_NUMBERS` falar contigo.
- `/reset` limpa a memória da conversa.
- Novas ferramentas: `src/tools.js`.

## Aviso
Baileys é uma biblioteca não oficial: usar em conta pessoal viola os Termos do WhatsApp e há risco de banimento. Para produção/negócio usa a WhatsApp Business Cloud API (webhook) — a camada `src/agent.js` reutiliza-se tal e qual.
