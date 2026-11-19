import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT} from './tokens';

export const clampX = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useEnter = (delay: number, damping = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness: 120, mass: 0.9}});
};

export const typed = (text: string, frame: number, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], clampX)));

export const Scene: React.FC<{readonly children: React.ReactNode; readonly pad?: string}> = ({
  children,
  pad = '90px 120px',
}) => <AbsoluteFill style={{fontFamily: FONT, padding: pad, color: C.ink}}>{children}</AbsoluteFill>;

export const Words: React.FC<{
  readonly text: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly style?: React.CSSProperties;
  readonly wordStyle?: React.CSSProperties;
  readonly center?: boolean;
}> = ({text, delay = 0, stagger = 4, style, wordStyle, center}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '0.28em',
        justifyContent: center ? 'center' : 'flex-start',
        ...style,
      }}
    >
      {text.split(' ').map((w, i) => {
        const s = spring({frame: frame - delay - i * stagger, fps, config: {damping: 20, stiffness: 140}});
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.14em'}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 110}%)`,
                opacity: s,
                filter: `blur(${(1 - s) * 10}px)`,
                ...wordStyle,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{readonly children: React.ReactNode; readonly delay?: number}> = ({
  children,
  delay = 0,
}) => {
  const s = useEnter(delay);
  return (
    <div
      style={{
        fontSize: 40,
        letterSpacing: 8,
        textTransform: 'uppercase',
        color: C.cyan,
        fontWeight: 600,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Glass: React.FC<{
  readonly delay?: number;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
  readonly glow?: string;
}> = ({delay = 0, children, style, glow = C.blue}) => {
  const s = useEnter(delay);
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
        border: '1.5px solid rgba(255,255,255,0.18)',
        borderRadius: 36,
        padding: 44,
        backdropFilter: 'blur(24px)',
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 90px ${glow}30, inset 0 1.5px 0 rgba(255,255,255,0.28)`,
        opacity: s,
        transform: `translateY(${(1 - s) * 70}px) scale(${0.94 + s * 0.06})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Logo: React.FC<{
  readonly name: string;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({name, size, style}) => (
  <Img src={staticFile(name)} style={{width: size, height: size, objectFit: 'contain', ...style}} />
);

export const LogoTile: React.FC<{
  readonly name: string;
  readonly label?: string;
  readonly size?: number;
  readonly delay?: number;
  readonly style?: React.CSSProperties;
}> = ({name, label, size = 150, delay = 0, style}) => {
  const s = useEnter(delay, 14);
  return (
    <div
      style={{
        width: size,
        height: size + (label ? 48 : 0),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: size * 0.26,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
        border: '1.5px solid rgba(255,255,255,0.22)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 1.5px 0 rgba(255,255,255,0.3)',
        opacity: s,
        transform: `scale(${0.4 + s * 0.6}) rotate(${(1 - s) * -12}deg)`,
        ...style,
      }}
    >
      <Logo name={name} size={size * 0.56} />
      {label ? <div style={{fontSize: 30, fontWeight: 600, color: C.ink}}>{label}</div> : null}
    </div>
  );
};

export const Pill: React.FC<{
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({children, color = C.blue, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 40,
      fontWeight: 700,
      color: C.ink,
      background: `${color}33`,
      border: `2px solid ${color}`,
      borderRadius: 999,
      padding: '10px 34px',
      ...style,
    }}
  >
    {children}
  </div>
);

export const CheckIcon: React.FC<{readonly progress: number; readonly color?: string; readonly size?: number}> = ({
  progress,
  color = C.green,
  size = 64,
}) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="32" fill={color} opacity={progress} />
    <path
      d="M20 37 L31 48 L53 25"
      fill="none"
      stroke="white"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={60}
      strokeDashoffset={60 * (1 - progress)}
    />
  </svg>
);

export const Appear: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly style?: React.CSSProperties;
}> = ({delay, children, x = 0, y = 0, style}) => {
  const s = useEnter(delay);
  return (
    <div style={{opacity: s, transform: `translate(${(1 - s) * x}px, ${(1 - s) * y}px)`, ...style}}>
      {children}
    </div>
  );
};
