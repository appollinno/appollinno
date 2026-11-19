import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, gradText, LOGOS} from './tokens';
import {Appear, clampX, Glass, Kicker, Logo, LogoTile, Pill, Scene, useEnter, Words} from './ui';

/* 1 — Abertura */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(0, 12);
  const pulse = 1 + 0.06 * Math.sin(frame * 0.12);
  const shine = interpolate(frame, [20, 110], [-40, 140], clampX);
  return (
    <Scene>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 190, height: 190, marginBottom: 24}}>
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 20) % 60) / 60;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `3px solid ${C.cyan}`,
                  opacity: (1 - t) * 0.5 * logo,
                  transform: `scale(${1 + t * 0.55})`,
                }}
              />
            );
          })}
          <Logo
            name={LOGOS.intune}
            size={190}
            style={{
              transform: `scale(${logo * pulse}) rotate(${(1 - logo) * -25}deg)`,
              filter: `drop-shadow(0 0 40px ${C.cyan}aa)`,
            }}
          />
        </div>
        <Kicker delay={10}>Azure User Group Moçambique apresenta</Kicker>
        <Words
          text="INTUNE SUMMIT"
          delay={16}
          center
          style={{fontSize: 210, fontWeight: 900, lineHeight: 1.02, letterSpacing: -4, marginTop: 10}}
          wordStyle={{
            background: `linear-gradient(100deg, #fff ${shine - 30}%, ${C.cyan} ${shine}%, #fff ${shine + 30}%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        />
        <Words
          text="MOÇAMBIQUE"
          delay={28}
          center
          style={{fontSize: 130, fontWeight: 800, letterSpacing: 16}}
          wordStyle={gradText}
        />
        <div style={{marginTop: 36}}>
          <Pill color={C.red} style={{fontSize: 52, padding: '14px 56px', opacity: useEnter(46), transform: `scale(${0.7 + useEnter(46) * 0.3})`}}>
            1.ª EDIÇÃO
          </Pill>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 2 — Data */
export const SceneDate: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [30, 90], [0, 1], {...clampX, easing: Easing.inOut(Easing.cubic)});
  const hour = 9 + progress * 8;
  const hh = Math.floor(hour);
  const mm = Math.floor((hour - hh) * 60);
  const dot = 0.5 + 0.5 * Math.sin(frame * 0.3);
  return (
    <Scene>
      <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 140px', gap: 100}}>
        <div style={{textAlign: 'center'}}>
          <Kicker>Reserve a data</Kicker>
          <Words
            text="28"
            center
            style={{fontSize: 520, fontWeight: 900, lineHeight: 0.95, letterSpacing: -20}}
            wordStyle={gradText}
          />
          <Words
            text="NOVEMBRO"
            delay={10}
            center
            style={{fontSize: 96, fontWeight: 800, letterSpacing: 18}}
          />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 40}}>
          <Glass delay={14} style={{padding: '34px 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 26, height: 26, borderRadius: '50%', background: C.green, boxShadow: `0 0 ${30 * dot}px ${C.green}`}} />
              <div style={{fontSize: 64, fontWeight: 800}}>100% Online</div>
            </div>
          </Glass>
          <Glass delay={24} style={{padding: '34px 44px'}}>
            <div style={{fontSize: 44, color: C.mute}}>Horário (hora de Maputo)</div>
            <div style={{fontSize: 104, fontWeight: 900, letterSpacing: -2, whiteSpace: 'nowrap', ...gradText}}>09:00 — 17:00</div>
            <div style={{marginTop: 24, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.12)', position: 'relative'}}>
              <div style={{height: '100%', width: `${progress * 100}%`, borderRadius: 9, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, boxShadow: `0 0 30px ${C.cyan}`}} />
            </div>
            <div style={{fontSize: 44, color: C.cyan, marginTop: 18, fontWeight: 700}}>
              {String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')} · 8 horas de sessões
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 3 — Ecossistema */
const orbit = [
  {logo: LOGOS.intune, label: 'Intune'},
  {logo: LOGOS.m365, label: 'Microsoft 365'},
  {logo: LOGOS.purview, label: 'Purview'},
  {logo: LOGOS.defender, label: 'Defender'},
  {logo: LOGOS.copilot, label: 'Copilot'},
  {logo: LOGOS.azure, label: 'Azure'},
  {logo: LOGOS.entra, label: 'Entra ID'},
];

export const SceneEcosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 1330;
  const cy = 540;
  const R = 330;
  const core = useEnter(4);
  return (
    <Scene>
      <div style={{position: 'absolute', left: 120, top: 250, width: 760}}>
        <Kicker>O ecossistema</Kicker>
        <Words text="Uma plataforma." delay={6} style={{fontSize: 110, fontWeight: 900, lineHeight: 1.05, marginTop: 12}} />
        <Words text="Segurança de ponta a ponta." delay={18} style={{fontSize: 84, fontWeight: 700, lineHeight: 1.1, marginTop: 16}} wordStyle={gradText} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="6 14" />
        {orbit.map((o, i) => {
          const a = ((i / orbit.length) * 360 + frame * 0.45 - 90) * (Math.PI / 180);
          return (
            <line key={o.label} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke={C.cyan} strokeOpacity={0.25 * core} strokeWidth={2} />
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: cx - 120,
          top: cy - 120,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.blue}, ${C.violet})`,
          boxShadow: `0 0 120px ${C.blue}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 44,
          fontWeight: 900,
          lineHeight: 1.1,
          transform: `scale(${core})`,
        }}
      >
        ZERO
        <br />
        TRUST
      </div>
      {orbit.map((o, i) => {
        const a = ((i / orbit.length) * 360 + frame * 0.45 - 90) * (Math.PI / 180);
        return (
          <LogoTile
            key={o.label}
            name={o.logo}
            size={150}
            delay={14 + i * 6}
            style={{position: 'absolute', left: cx + R * Math.cos(a) - 75, top: cy + R * Math.sin(a) - 75}}
          />
        );
      })}
      <div style={{position: 'absolute', left: 120, bottom: 110, display: 'flex', gap: 14, flexWrap: 'wrap', width: 780}}>
        {orbit.map((o, i) => (
          <Appear key={o.label} delay={40 + i * 4} y={20}>
            <Pill color={C.blue} style={{fontSize: 34, padding: '6px 24px'}}>
              {o.label}
            </Pill>
          </Appear>
        ))}
      </div>
    </Scene>
  );
};

/* 4 — M365 Admin Portal + Intune */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
const nav = ['Início', 'Utilizadores', 'Dispositivos', 'Segurança', 'Intune'];

export const SceneAdmin: React.FC = () => {
  const frame = useCurrentFrame();
  const users = Math.round(interpolate(frame, [30, 90], [0, 1248], {...clampX, easing: Easing.out(Easing.cubic)}));
  const devices = Math.round(interpolate(frame, [36, 96], [0, 3562], {...clampX, easing: Easing.out(Easing.cubic)}));
  const compliant = Math.round(interpolate(frame, [40, 100], [0, 96], {...clampX, easing: Easing.out(Easing.cubic)}));
  const bars = [62, 78, 70, 88, 82, 94, 96];
  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <Logo name={LOGOS.m365} size={110} />
        <Logo name={LOGOS.intune} size={110} />
        <div>
          <Kicker>Administração</Kicker>
          <Words text="Microsoft 365 Admin Center + Intune" delay={4} style={{fontSize: 72, fontWeight: 900, lineHeight: 1.1}} />
        </div>
      </div>
      <Glass delay={10} style={{marginTop: 50, padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '22px 34px', borderBottom: '1.5px solid rgba(255,255,255,0.14)'}}>
          {[C.red, C.gold, C.green].map((c) => (
            <div key={c} style={{width: 22, height: 22, borderRadius: '50%', background: c}} />
          ))}
          <div style={{marginLeft: 24, fontSize: 36, color: C.mute}}>admin.microsoft.com</div>
        </div>
        <div style={{display: 'flex', flex: 1}}>
          <div style={{width: 360, padding: 30, borderRight: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 14}}>
            {nav.map((n, i) => {
              const active = n === 'Dispositivos';
              return (
                <Appear key={n} delay={24 + i * 5} x={-30}>
                  <div style={{fontSize: 40, fontWeight: 600, padding: '14px 22px', borderRadius: 16, background: active ? `${C.blue}55` : 'transparent', color: active ? '#fff' : C.mute}}>
                    {n}
                  </div>
                </Appear>
              );
            })}
          </div>
          <div style={{flex: 1, padding: 36, display: 'flex', flexDirection: 'column', gap: 28}}>
            <div style={{display: 'flex', gap: 28}}>
              {[
                {l: 'Utilizadores activos', v: fmt(users), c: C.cyan},
                {l: 'Dispositivos geridos', v: fmt(devices), c: C.blue},
                {l: 'Conformes', v: `${compliant}%`, c: C.green},
              ].map((t) => (
                <div key={t.l} style={{flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 24, padding: '22px 28px', border: '1.5px solid rgba(255,255,255,0.1)'}}>
                  <div style={{fontSize: 34, color: C.mute}}>{t.l}</div>
                  <div style={{fontSize: 78, fontWeight: 900, color: t.c}}>{t.v}</div>
                </div>
              ))}
            </div>
            <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 26, paddingBottom: 6}}>
              {bars.map((b, i) => {
                const s = interpolate(frame, [50 + i * 4, 80 + i * 4], [0, 1], {...clampX, easing: Easing.out(Easing.cubic)});
                return (
                  <div key={i} style={{flex: 1, height: `${b * s}%`, minHeight: 6, borderRadius: 14, background: `linear-gradient(180deg, ${C.cyan}, ${C.blue})`, boxShadow: `0 0 30px ${C.blue}66`}} />
                );
              })}
            </div>
          </div>
        </div>
      </Glass>
    </Scene>
  );
};

/* 5 — Secure Score */
const cats = [
  {l: 'Identidade', v: 92, c: C.cyan},
  {l: 'Dispositivos', v: 85, c: C.blue},
  {l: 'Aplicações', v: 81, c: C.violet},
  {l: 'Dados', v: 90, c: C.pink},
];

export const SceneScore: React.FC = () => {
  const frame = useCurrentFrame();
  const r = 250;
  const circ = 2 * Math.PI * r;
  const p = interpolate(frame, [14, 90], [0, 0.87], {...clampX, easing: Easing.out(Easing.cubic)});
  const g = useEnter(0);
  return (
    <Scene>
      <Kicker>Microsoft Secure Score</Kicker>
      <Words text="Meça. Melhore. Proteja." delay={4} style={{fontSize: 100, fontWeight: 900, marginTop: 10}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 120, marginTop: 30, flex: 1}}>
        <div style={{position: 'relative', width: 640, height: 640, transform: `scale(${0.85 + g * 0.15})`, opacity: g}}>
          <svg width={640} height={640} viewBox="0 0 640 640">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.cyan} />
                <stop offset="100%" stopColor={C.violet} />
              </linearGradient>
            </defs>
            <circle cx="320" cy="320" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="44" />
            <circle cx="320" cy="320" r={r} fill="none" stroke="url(#sg)" strokeWidth="44" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} transform="rotate(-90 320 320)" style={{filter: `drop-shadow(0 0 24px ${C.cyan})`}} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 160, fontWeight: 900, letterSpacing: -6, ...gradText}}>{Math.round(p * 100)}%</div>
            <div style={{fontSize: 44, color: C.mute}}>Pontuação</div>
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 36}}>
          {cats.map((c, i) => {
            const w = interpolate(frame, [24 + i * 8, 70 + i * 8], [0, c.v], {...clampX, easing: Easing.out(Easing.cubic)});
            return (
              <Appear key={c.l} delay={18 + i * 8} x={-40}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 46, fontWeight: 700, marginBottom: 12}}>
                  <span>{c.l}</span>
                  <span style={{color: c.c}}>{Math.round(w)}%</span>
                </div>
                <div style={{height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)'}}>
                  <div style={{height: '100%', width: `${w}%`, borderRadius: 11, background: c.c, boxShadow: `0 0 28px ${c.c}`}} />
                </div>
              </Appear>
            );
          })}
        </div>
      </div>
      <div style={{fontSize: 30, color: C.mute}}>Valores ilustrativos</div>
    </Scene>
  );
};
