import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, gradText, LOGOS} from './tokens';
import {CheckIcon, clampX, Glass, Kicker, Logo, LogoTile, Pill, Scene, typed, useEnter, Words} from './ui';

/* 6 — Zero Trust */
const Principle: React.FC<{
  readonly n: string;
  readonly title: string;
  readonly text: string;
  readonly delay: number;
  readonly color: string;
}> = ({n, title, text, delay, color}) => (
  <Glass delay={delay} glow={color} style={{flex: 1, padding: 36}}>
    <div style={{fontSize: 90, fontWeight: 900, color, lineHeight: 1}}>{n}</div>
    <div style={{fontSize: 52, fontWeight: 800, margin: '10px 0 10px'}}>{title}</div>
    <div style={{fontSize: 40, color: C.mute, lineHeight: 1.3}}>{text}</div>
  </Glass>
);

export const SceneZeroTrust: React.FC = () => {
  const frame = useCurrentFrame();
  const shield = useEnter(0, 12);
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
        <svg width={150} height={174} viewBox="0 0 190 220" style={{transform: `scale(${shield}) rotate(${(1 - shield) * 20}deg)`, filter: `drop-shadow(0 0 40px ${C.cyan})`}}>
          <defs>
            <linearGradient id="zt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="100%" stopColor={C.violet} />
            </linearGradient>
          </defs>
          <path d="M95 8 L176 40 V108 C176 160 140 192 95 212 C50 192 14 160 14 108 V40 Z" fill="url(#zt)" />
          <path d="M58 108 L84 134 L134 80" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - interpolate(frame, [14, 36], [0, 1], clampX))} />
        </svg>
        <div>
          <Kicker>Estratégia</Kicker>
          <Words text="Zero Trust" delay={4} style={{fontSize: 180, fontWeight: 900, lineHeight: 1, letterSpacing: -5}} wordStyle={gradText} />
        </div>
      </div>
      <Words text="Nunca confie. Verifique sempre." delay={16} style={{fontSize: 64, fontWeight: 700, marginTop: 6}} />
      <div style={{display: 'flex', gap: 36, marginTop: 36}}>
        <Principle n="01" title="Verificar explicitamente" text="Identidade, dispositivo e local em cada pedido." delay={24} color={C.cyan} />
        <Principle n="02" title="Menor privilégio" text="Apenas o acesso necessário, pelo tempo necessário." delay={34} color={C.violet} />
        <Principle n="03" title="Assumir violação" text="Segmentar, monitorizar e responder depressa." delay={44} color={C.pink} />
      </div>
    </Scene>
  );
};

/* 7 — Entra ID + Acesso Condicional */
const Node: React.FC<{
  readonly delay: number;
  readonly title: string;
  readonly lines: string[];
  readonly color?: string;
  readonly logo?: string;
}> = ({delay, title, lines, color = C.blue, logo}) => (
  <Glass delay={delay} glow={color} style={{width: 380, padding: 34, borderColor: `${color}aa`}}>
    {logo ? <Logo name={logo} size={84} style={{marginBottom: 12}} /> : null}
    <div style={{fontSize: 54, fontWeight: 800, marginBottom: 12}}>{title}</div>
    {lines.map((l) => (
      <div key={l} style={{fontSize: 42, color: C.mute, lineHeight: 1.35}}>
        {l}
      </div>
    ))}
  </Glass>
);

const Link: React.FC<{readonly delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], clampX);
  return (
    <svg width={100} height={44} viewBox="0 0 100 44">
      <path d="M0 22 H78 M58 6 L80 22 L58 38" fill="none" stroke={C.cyan} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={150} strokeDashoffset={150 * (1 - p)} style={{filter: `drop-shadow(0 0 8px ${C.cyan})`}} />
    </svg>
  );
};

export const SceneAccess: React.FC = () => {
  const frame = useCurrentFrame();
  const ok = interpolate(frame, [96, 112], [0, 1], clampX);
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <Logo name={LOGOS.entra} size={130} style={{filter: `drop-shadow(0 0 30px ${C.blue})`}} />
        <div>
          <Kicker>Microsoft Entra ID</Kicker>
          <Words text="Acesso Condicional" delay={4} style={{fontSize: 120, fontWeight: 900, lineHeight: 1.05}} wordStyle={gradText} />
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 90}}>
        <Node delay={16} title="Utilizador" lines={['Início de sessão', 'em Moçambique']} />
        <Link delay={30} />
        <Node delay={32} title="Entra ID" lines={['Identidade', 'Dispositivo', 'Risco']} logo={LOGOS.entra} />
        <Link delay={48} />
        <Node delay={50} title="Política" lines={['Exigir MFA', 'Dispositivo conforme']} color={C.violet} />
        <Link delay={66} />
        <Node delay={68} title="Decisão" lines={['Acesso concedido']} color={C.green} />
      </div>
      <div style={{position: 'absolute', right: 150, bottom: 100, opacity: ok, transform: `scale(${0.6 + ok * 0.4})`}}>
        <Pill color={C.green} style={{fontSize: 52, padding: '14px 44px'}}>
          <CheckIcon progress={ok} size={56} /> Acesso seguro
        </Pill>
      </div>
    </Scene>
  );
};

/* 8 — PIM JIT */
const steps = ['Pedir', 'Aprovar', 'Activar', 'Expirar'];

export const ScenePim: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame >= 56;
  const t = interpolate(frame, [56, 129], [0, 1], clampX);
  const remaining = Math.round(3600 * (1 - t));
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const knob = interpolate(frame, [52, 60], [0, 1], {...clampX, easing: Easing.out(Easing.cubic)});
  const stepDone = [26, 42, 58, 128].map((s) => interpolate(frame, [s, s + 12], [0, 1], clampX));
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <Logo name={LOGOS.entra} size={120} />
        <div>
          <Kicker>Privileged Identity Management</Kicker>
          <Words text="Acesso Just-in-Time" delay={4} style={{fontSize: 120, fontWeight: 900, lineHeight: 1.05}} wordStyle={gradText} />
        </div>
      </div>
      <Glass delay={12} glow={active ? C.green : C.blue} style={{marginTop: 60, padding: 54}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 64, fontWeight: 800}}>Intune Administrator</div>
            <div style={{fontSize: 44, color: C.mute, marginTop: 8}}>{active ? 'Função activa — acesso temporário' : 'Função elegível'}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{fontSize: 50, fontWeight: 700, color: active ? C.green : C.mute}}>{active ? 'Activa' : 'Elegível'}</div>
            <div style={{width: 150, height: 80, borderRadius: 40, background: active ? C.green : 'rgba(255,255,255,0.2)', position: 'relative'}}>
              <div style={{position: 'absolute', top: 8, left: 8 + knob * 70, width: 64, height: 64, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.4)'}} />
            </div>
          </div>
        </div>
        <div style={{marginTop: 40, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.12)'}}>
          <div style={{height: '100%', width: `${active ? (1 - t) * 100 : 100}%`, borderRadius: 11, background: `linear-gradient(90deg, ${C.gold}, ${C.pink})`, boxShadow: `0 0 26px ${C.gold}`}} />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 24}}>
          <div style={{fontSize: 130, fontWeight: 900, color: C.gold, letterSpacing: -2}}>{active ? `${mm}:${ss}` : '60:00'}</div>
          <div style={{fontSize: 44, color: C.mute}}>até a função expirar</div>
        </div>
      </Glass>
      <div style={{display: 'flex', gap: 28, marginTop: 46}}>
        {steps.map((s, i) => (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: 0.35 + stepDone[i] * 0.65}}>
            <CheckIcon progress={stepDone[i]} size={56} />
            <span style={{fontSize: 46, fontWeight: 700}}>{s}</span>
            {i < steps.length - 1 ? <span style={{fontSize: 46, color: C.mute, marginLeft: 12}}>→</span> : null}
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 9 — Copilot */
const question = 'Porque é que este dispositivo está não conforme?';
const answer = 'O BitLocker não está activo neste dispositivo. Posso criar a política de encriptação e atribuí-la ao grupo certo.';

export const SceneCopilot: React.FC = () => {
  const frame = useCurrentFrame();
  const c1 = useEnter(96);
  const c2 = useEnter(104);
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <Logo name={LOGOS.copilot} size={150} style={{filter: `drop-shadow(0 0 40px ${C.pink}88)`}} />
        <div>
          <Kicker>Microsoft Copilot</Kicker>
          <Words text="Copilot no Intune" delay={4} style={{fontSize: 120, fontWeight: 900, lineHeight: 1.05}} wordStyle={gradText} />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 56}}>
        <Glass delay={12} style={{alignSelf: 'flex-end', maxWidth: 1250, padding: '30px 40px', background: `linear-gradient(145deg, ${C.blue}66, ${C.blue}22)`}}>
          <div style={{fontSize: 52}}>{typed(question, frame, 18, 50)}</div>
        </Glass>
        <Glass delay={54} glow={C.pink} style={{maxWidth: 1450, padding: '30px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
            <Logo name={LOGOS.copilot} size={54} />
            <div style={{fontSize: 44, fontWeight: 700, color: C.pink}}>Copilot</div>
          </div>
          <div style={{fontSize: 52, lineHeight: 1.3, minHeight: 140}}>{typed(answer, frame, 62, 100)}</div>
        </Glass>
        <div style={{display: 'flex', gap: 24}}>
          <Pill color={C.cyan} style={{opacity: c1, transform: `translateY(${(1 - c1) * 30}px)`}}>Criar política</Pill>
          <Pill color={C.violet} style={{opacity: c2, transform: `translateY(${(1 - c2) * 30}px)`}}>Atribuir ao grupo</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 10 — Security Copilot */
const summary = 'Início de sessão suspeito a partir de um local invulgar. Recomendo revogar a sessão, exigir MFA e rever os dados acedidos.';

export const SceneSecurityCopilot: React.FC = () => {
  const frame = useCurrentFrame();
  const r = 120;
  const circ = 2 * Math.PI * r;
  const score = Math.round(interpolate(frame, [30, 95], [0, 87], {...clampX, easing: Easing.out(Easing.cubic)}));
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <Logo name={LOGOS.copilot} size={120} />
        <Logo name={LOGOS.defender} size={120} />
        <Logo name={LOGOS.purview} size={120} />
        <div>
          <Kicker>Security Copilot</Kicker>
          <Words text="Resposta a incidentes" delay={4} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.05}} wordStyle={gradText} />
        </div>
      </div>
      <div style={{display: 'flex', gap: 44, marginTop: 56}}>
        <Glass delay={12} glow={C.red} style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Pill color={C.red} style={{fontSize: 38}}>Gravidade alta</Pill>
            <div style={{fontSize: 54, fontWeight: 800}}>Incidente #1042</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0 10px'}}>
            <Logo name={LOGOS.defender} size={52} />
            <div style={{fontSize: 42, color: C.cyan, fontWeight: 700}}>Microsoft Defender · resumo do Security Copilot</div>
          </div>
          <div style={{fontSize: 48, lineHeight: 1.32, minHeight: 250}}>{typed(summary, frame, 30, 110)}</div>
        </Glass>
        <Glass delay={22} glow={C.red} style={{width: 470, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <svg width={290} height={290} viewBox="0 0 290 290" style={{overflow: 'visible'}}>
            <circle cx="145" cy="145" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="28" />
            <circle cx="145" cy="145" r={r} fill="none" stroke={C.red} strokeWidth="28" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} transform="rotate(-90 145 145)" style={{filter: `drop-shadow(0 0 16px ${C.red})`}} />
            <text x="145" y="168" textAnchor="middle" fontSize="88" fontWeight="900" fill="#fff">{score}</text>
          </svg>
          <div style={{fontSize: 42, color: C.mute, marginTop: 10, textAlign: 'center'}}>Pontuação de risco</div>
        </Glass>
      </div>
    </Scene>
  );
};

/* 11 — Encerramento */
const row = [LOGOS.intune, LOGOS.m365, LOGOS.purview, LOGOS.defender, LOGOS.copilot, LOGOS.entra, LOGOS.azure];

export const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);
  const cta = useEnter(52);
  return (
    <Scene>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Pill color={C.red} style={{fontSize: 48, padding: '10px 50px', opacity: useEnter(0)}}>1.ª EDIÇÃO</Pill>
        <Words text="INTUNE SUMMIT" delay={6} center style={{fontSize: 190, fontWeight: 900, lineHeight: 1.05, letterSpacing: -4, marginTop: 18}} wordStyle={gradText} />
        <Words text="MOÇAMBIQUE" delay={16} center style={{fontSize: 110, fontWeight: 800, letterSpacing: 16}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 36, fontSize: 62, fontWeight: 800, opacity: useEnter(30)}}>
          <span>28 NOV</span>
          <span style={{color: C.cyan}}>·</span>
          <span>09:00 — 17:00</span>
          <span style={{color: C.cyan}}>·</span>
          <span style={{color: C.green}}>ONLINE</span>
        </div>
        <div style={{display: 'flex', gap: 26, marginTop: 46}}>
          {row.map((l, i) => (
            <LogoTile key={l} name={l} size={120} delay={34 + i * 5} />
          ))}
        </div>
        <div style={{marginTop: 50, opacity: cta, transform: `scale(${0.8 + cta * 0.2})`}}>
          <div style={{fontSize: 56, fontWeight: 800, padding: '18px 70px', borderRadius: 999, background: `linear-gradient(90deg, ${C.blue}, ${C.violet})`, boxShadow: `0 0 ${50 + pulse * 50}px ${C.blue}aa`}}>
            Reserve a data
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 34, fontSize: 40, color: C.mute}}>
          <Logo name={LOGOS.azure} size={46} /> Azure User Group Moçambique
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
