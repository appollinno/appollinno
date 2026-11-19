import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors, font} from './theme';

export const FlagStripe: React.FC = () => (
  <div style={{display: 'flex', height: 12, width: 360, borderRadius: 6, overflow: 'hidden'}}>
    <div style={{flex: 1, background: colors.green}} />
    <div style={{flex: 1, background: colors.yellow}} />
    <div style={{flex: 1, background: colors.red}} />
  </div>
);

const useFadeUp = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return {
    opacity: s,
    transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
  };
};

export const Line: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
}> = ({delay, children, style}) => {
  const anim = useFadeUp(delay);
  return <div style={{fontFamily: font, ...style, ...anim}}>{children}</div>;
};

export const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 150], [-100, 100], {easing: Easing.inOut(Easing.quad), extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${50 + x / 5}% 40%, ${colors.blue}55 0%, transparent 55%)`,
      }}
    />
  );
};

const IntroInner: React.FC = () => (
  <>
    <Glow />
    <Line delay={0} style={{fontSize: 52, color: colors.lightBlue, letterSpacing: 8, textTransform: 'uppercase'}}>
      Azure User Group Mozambique presents
    </Line>
    <Line delay={8} style={{fontSize: 190, fontWeight: 800, color: colors.white, lineHeight: 1.05, textAlign: 'center'}}>
      Intune Summit
    </Line>
    <Line delay={16} style={{fontSize: 130, fontWeight: 700, color: colors.yellow}}>
      Moçambique 2026
    </Line>
    <Line delay={26} style={{marginTop: 40}}>
      <FlagStripe />
    </Line>
  </>
);

export const Intro = Interactive.create({
  Component: IntroInner,
  layout: 'absolute-fill',
  schema: {...Interactive.backgroundSchema},
});

const TopicsInner: React.FC<{readonly heading: string; readonly topics: string}> = ({heading, topics}) => {
  const list = topics.split('|');
  return (
    <>
      <Glow />
      <Line delay={0} style={{fontSize: 96, fontWeight: 800, color: colors.white}}>
        {heading}
      </Line>
      <div style={{display: 'flex', gap: 40, marginTop: 70}}>
        {list.map((t, i) => (
          <Line
            key={t}
            delay={12 + i * 10}
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: colors.white,
              background: `${colors.blue}33`,
              border: `3px solid ${colors.blue}`,
              borderRadius: 28,
              padding: '40px 50px',
              minWidth: 380,
              textAlign: 'center',
            }}
          >
            {t}
          </Line>
        ))}
      </div>
    </>
  );
};

export const Topics = Interactive.create({
  Component: TopicsInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    heading: {type: 'string', default: '', description: 'Heading'},
    topics: {type: 'string', default: '', description: 'Topics separated by |'},
  },
});

const CtaInner: React.FC<{readonly line1: string; readonly line2: string}> = ({line1, line2}) => (
  <>
    <Glow />
    <Line delay={0} style={{fontSize: 120, fontWeight: 800, color: colors.white}}>
      {line1}
    </Line>
    <Line delay={10} style={{fontSize: 64, color: colors.yellow, fontWeight: 600, marginTop: 20}}>
      {line2}
    </Line>
    <Line delay={20} style={{marginTop: 50}}>
      <FlagStripe />
    </Line>
    <Line delay={28} style={{fontSize: 44, color: colors.muted, marginTop: 40}}>
      Azure User Group Mozambique
    </Line>
  </>
);

export const Cta = Interactive.create({
  Component: CtaInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    line1: {type: 'string', default: '', description: 'Main line'},
    line2: {type: 'string', default: '', description: 'Secondary line'},
  },
});
