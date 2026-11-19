import React from 'react';
import {
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FlagStripe, Glow, Line} from './Scenes';
import {colors, font} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Pad: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      flex: 1,
      padding: '100px 120px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
    }}
  >
    {children}
  </div>
);

const Header: React.FC<{readonly kicker: string; readonly title: string}> = ({kicker, title}) => (
  <div>
    <Line delay={0} style={{fontSize: 44, color: colors.lightBlue, letterSpacing: 6, textTransform: 'uppercase'}}>
      {kicker}
    </Line>
    <Line delay={6} style={{fontSize: 96, fontWeight: 800, color: colors.white, marginTop: 10}}>
      {title}
    </Line>
  </div>
);

const useAppear = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200}});
};

const Card: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({delay, children, style}) => {
  const s = useAppear(delay);
  return (
    <div
      style={{
        background: `${colors.blue}26`,
        border: `3px solid ${colors.blue}`,
        borderRadius: 32,
        padding: 44,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.95, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Check: React.FC<{readonly delay: number; readonly color?: string; readonly size?: number}> = ({
  delay,
  color = colors.green,
  size = 72,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="32" fill={color} opacity={p} />
      <path
        d="M20 37 L31 48 L53 25"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={60}
        strokeDashoffset={60 * (1 - p)}
      />
    </svg>
  );
};

const typed = (text: string, frame: number, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], clamp)));

/* ---------- 1. Intro ---------- */
const IntroInner: React.FC = () => (
  <>
    <Glow />
    <Pad>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Line delay={0} style={{fontSize: 48, color: colors.lightBlue, letterSpacing: 8, textTransform: 'uppercase'}}>
          Azure User Group Moçambique apresenta
        </Line>
        <Line delay={8} style={{fontSize: 180, fontWeight: 800, color: colors.white, lineHeight: 1.05}}>
          Intune Summit
        </Line>
        <Line delay={16} style={{fontSize: 120, fontWeight: 700, color: colors.yellow}}>
          Moçambique
        </Line>
        <Line
          delay={26}
          style={{
            marginTop: 40,
            fontSize: 64,
            fontWeight: 700,
            color: colors.white,
            background: colors.red,
            padding: '14px 48px',
            borderRadius: 999,
          }}
        >
          1.ª Edição
        </Line>
      </div>
    </Pad>
  </>
);
export const EdIntro = Interactive.create({
  Component: IntroInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 2. Intune ---------- */
const devices = [
  {name: 'Windows 11', policy: 'BitLocker activo'},
  {name: 'iPhone', policy: 'Código de acesso'},
  {name: 'Android', policy: 'Perfil de trabalho'},
];

const IntuneInner: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = Math.round(interpolate(frame, [40, 100], [0, 98], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <>
      <Glow />
      <Pad>
        <Header kicker="Microsoft Intune" title="Gestão moderna de dispositivos" />
        <div style={{display: 'flex', gap: 40, marginTop: 80}}>
          {devices.map((d, i) => (
            <Card key={d.name} delay={14 + i * 10} style={{flex: 1}}>
              <div style={{fontSize: 56, fontWeight: 700, color: colors.white}}>{d.name}</div>
              <div style={{fontSize: 44, color: colors.muted, margin: '16px 0 32px'}}>{d.policy}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                <Check delay={34 + i * 10} />
                <span style={{fontSize: 44, color: colors.white}}>Conforme</span>
              </div>
            </Card>
          ))}
        </div>
        <Line delay={30} style={{marginTop: 60, fontSize: 56, color: colors.white, fontWeight: 600}}>
          Conformidade da frota:{' '}
          <span style={{color: colors.yellow, fontWeight: 800}}>{pct}%</span>
        </Line>
      </Pad>
    </>
  );
};
export const EdIntune = Interactive.create({
  Component: IntuneInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 3. Copilot ---------- */
const question = 'Porque é que este dispositivo está não conforme?';
const answer = 'O BitLocker não está activo. Posso criar uma política de encriptação e atribuí-la ao grupo.';

const CopilotInner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Glow />
      <Pad>
        <Header kicker="Copilot no Intune" title="Pergunte. Entenda. Aja." />
        <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 36, width: 1500}}>
          <Card delay={14} style={{alignSelf: 'flex-end', background: `${colors.blue}55`, maxWidth: 1200}}>
            <div style={{fontSize: 48, color: colors.white}}>{typed(question, frame, 20, 52)}</div>
          </Card>
          <Card delay={58} style={{maxWidth: 1400, borderColor: colors.lightBlue}}>
            <div style={{fontSize: 44, color: colors.lightBlue, fontWeight: 700, marginBottom: 14}}>Copilot</div>
            <div style={{fontSize: 48, color: colors.white, lineHeight: 1.3}}>{typed(answer, frame, 66, 118)}</div>
          </Card>
        </div>
      </Pad>
    </>
  );
};
export const EdCopilot = Interactive.create({
  Component: CopilotInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 4. Security Copilot ---------- */
const summary = 'Início de sessão suspeito a partir de um local invulgar. Recomendo revogar a sessão e exigir MFA.';

const SecurityInner: React.FC = () => {
  const frame = useCurrentFrame();
  const r = 110;
  const circ = 2 * Math.PI * r;
  const score = Math.round(interpolate(frame, [30, 90], [0, 87], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <>
      <Glow />
      <Pad>
        <Header kicker="Security Copilot" title="Resposta a incidentes com IA" />
        <div style={{display: 'flex', gap: 50, marginTop: 70, alignItems: 'stretch'}}>
          <Card delay={14} style={{flex: 1}}>
            <div
              style={{
                display: 'inline-block',
                fontSize: 40,
                fontWeight: 700,
                color: colors.white,
                background: colors.red,
                borderRadius: 999,
                padding: '6px 28px',
              }}
            >
              Gravidade alta
            </div>
            <div style={{fontSize: 52, fontWeight: 700, color: colors.white, margin: '24px 0 16px'}}>
              Incidente #1042
            </div>
            <div style={{fontSize: 44, color: colors.lightBlue, fontWeight: 700}}>Resumo do Security Copilot</div>
            <div style={{fontSize: 44, color: colors.white, lineHeight: 1.3, marginTop: 10, minHeight: 190}}>
              {typed(summary, frame, 34, 100)}
            </div>
          </Card>
          <Card delay={24} style={{width: 460, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <svg width={280} height={280} viewBox="0 0 280 280">
              <circle cx="140" cy="140" r={r} fill="none" stroke={`${colors.white}22`} strokeWidth="26" />
              <circle
                cx="140"
                cy="140"
                r={r}
                fill="none"
                stroke={colors.red}
                strokeWidth="26"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - score / 100)}
                transform="rotate(-90 140 140)"
              />
              <text x="140" y="158" textAnchor="middle" fontSize="80" fontWeight="800" fill="white" fontFamily={font}>
                {score}
              </text>
            </svg>
            <div style={{fontSize: 44, color: colors.muted, marginTop: 16, textAlign: "center"}}>Pontuação de risco</div>
          </Card>
        </div>
      </Pad>
    </>
  );
};
export const EdSecurityCopilot = Interactive.create({
  Component: SecurityInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 5. Conditional Access ---------- */
const Node: React.FC<{
  readonly delay: number;
  readonly title: string;
  readonly lines: string[];
  readonly accent?: string;
}> = ({delay, title, lines, accent = colors.blue}) => (
  <Card delay={delay} style={{width: 400, borderColor: accent, padding: 36}}>
    <div style={{fontSize: 52, fontWeight: 700, color: colors.white, marginBottom: 14}}>{title}</div>
    {lines.map((l) => (
      <div key={l} style={{fontSize: 44, color: colors.muted, lineHeight: 1.35}}>
        {l}
      </div>
    ))}
  </Card>
);

const Arrow: React.FC<{readonly delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
  return (
    <svg width={90} height={40} viewBox="0 0 90 40">
      <path d="M0 20 H70 M52 4 L72 20 L52 36" fill="none" stroke={colors.lightBlue} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - p)} />
    </svg>
  );
};

const CaInner: React.FC = () => (
  <>
    <Glow />
    <Pad>
      <Header kicker="Acesso Condicional" title="Confiança zero, em cada acesso" />
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 100}}>
        <Node delay={14} title="Utilizador" lines={['Início de sessão', 'na aplicação']} />
        <Arrow delay={26} />
        <Node delay={28} title="Sinais" lines={['Localização', 'Dispositivo', 'Risco']} />
        <Arrow delay={42} />
        <Node delay={44} title="Política" lines={['Exigir MFA', 'Dispositivo conforme']} />
        <Arrow delay={58} />
        <Node delay={60} title="Resultado" lines={['Acesso concedido']} accent={colors.green} />
      </div>
    </Pad>
  </>
);
export const EdConditionalAccess = Interactive.create({
  Component: CaInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 6. PIM JIT ---------- */
const PimInner: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame >= 50;
  const elapsed = interpolate(frame, [50, 119], [0, 1], clamp);
  const remaining = Math.round(3600 * (1 - elapsed));
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const color = active ? colors.green : colors.muted;
  return (
    <>
      <Glow />
      <Pad>
        <Header kicker="Privileged Identity Management" title="Acesso Just-in-Time" />
        <Card delay={14} style={{marginTop: 70, width: 1500}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontSize: 56, fontWeight: 700, color: colors.white}}>Intune Administrator</div>
              <div style={{fontSize: 44, color: colors.muted, marginTop: 10}}>
                Função {active ? 'activa por tempo limitado' : 'elegível'}
              </div>
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: colors.white,
                background: color,
                padding: '12px 40px',
                borderRadius: 999,
              }}
            >
              {active ? 'Activa' : 'Elegível'}
            </div>
          </div>
          <div style={{marginTop: 44, height: 24, borderRadius: 12, background: `${colors.white}22`, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${(1 - elapsed) * 100}%`, background: colors.yellow}} />
          </div>
          <div style={{fontSize: 96, fontWeight: 800, color: colors.yellow, marginTop: 24}}>
            {active ? `${mm}:${ss}` : '60:00'}
            <span style={{fontSize: 44, color: colors.muted, fontWeight: 400, marginLeft: 24}}>até expirar</span>
          </div>
        </Card>
      </Pad>
    </>
  );
};
export const EdPim = Interactive.create({
  Component: PimInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

/* ---------- 7. CTA ---------- */
const CtaInner: React.FC = () => (
  <>
    <Glow />
    <Pad>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Line delay={0} style={{fontSize: 56, color: colors.yellow, fontWeight: 600}}>
          1.ª Edição
        </Line>
        <Line delay={8} style={{fontSize: 150, fontWeight: 800, color: colors.white, lineHeight: 1.1}}>
          Intune Summit
        </Line>
        <Line delay={14} style={{fontSize: 110, fontWeight: 700, color: colors.white}}>
          Moçambique
        </Line>
        <Line delay={22} style={{marginTop: 40}}>
          <FlagStripe />
        </Line>
        <Line delay={30} style={{fontSize: 52, color: colors.muted, marginTop: 40}}>
          Reserve a data · Azure User Group Moçambique
        </Line>
      </div>
    </Pad>
  </>
);
export const EdCta = Interactive.create({
  Component: CtaInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});
