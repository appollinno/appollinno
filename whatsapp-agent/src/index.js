import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { config } from './config.js';
import { ask, resetConversation } from './agent.js';

const logger = pino({ level: config.logLevel });

const digits = (jid = '') => jid.split('@')[0].split(':')[0].replace(/\D/g, '');
const textOf = (m) =>
  m.message?.conversation ||
  m.message?.extendedTextMessage?.text ||
  m.message?.imageMessage?.caption ||
  '';

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'warn' }),
    browser: Browsers.macOS('Desktop'),
    markOnlineOnConnect: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\nEscaneia no WhatsApp: Definições > Dispositivos associados > Associar dispositivo\n');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') logger.info(`Ligado como ${sock.user?.id}`);
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        logger.error('Sessão terminada no telemóvel. Apaga a pasta auth/ e volta a emparelhar.');
        process.exit(1);
      }
      logger.warn({ code }, 'Ligação fechada, a reconectar...');
      setTimeout(start, 3000);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const m of messages) {
      try {
        if (!m.message || m.key.remoteJid === 'status@broadcast') continue;
        const jid = m.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');
        const text = textOf(m).trim();
        if (!text) continue;

        // "Mensagem a mim próprio" é o chat de comando; ignora o resto do que eu envio.
        const sender = isGroup ? digits(m.key.participant) : digits(jid);
        const selfChat = m.key.fromMe && sender === digits(sock.user?.id);
        if (m.key.fromMe && !selfChat) continue;

        if (!selfChat && !config.allowed.has(sender)) {
          logger.debug({ sender }, 'Número não autorizado, ignorado');
          continue;
        }
        if (isGroup) {
          const me = digits(sock.user?.id);
          const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.some((j) => digits(j) === me);
          if (!config.allowGroups || !mentioned) continue;
        }

        if (text === '/reset') {
          resetConversation(jid);
          await sock.sendMessage(jid, { text: 'Conversa reiniciada.' }, { quoted: m });
          continue;
        }

        logger.info({ jid, text }, 'Mensagem recebida');
        await sock.sendPresenceUpdate('composing', jid);
        const reply = await ask(jid, text);
        await sock.sendPresenceUpdate('paused', jid);
        await sock.sendMessage(jid, { text: reply }, { quoted: m });
      } catch (err) {
        logger.error({ err }, 'Erro a processar mensagem');
      }
    }
  });
}

start();
