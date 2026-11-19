import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './tokens';

const blobs = [
  {x: 0.2, y: 0.25, r: 1100, color: C.blue, speed: 0.012, phase: 0},
  {x: 0.8, y: 0.2, r: 1000, color: C.violet, speed: 0.009, phase: 2},
  {x: 0.65, y: 0.85, r: 1200, color: C.cyan, speed: 0.011, phase: 4},
  {x: 0.1, y: 0.9, r: 900, color: C.pink, speed: 0.008, phase: 1},
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      {blobs.map((b, i) => {
        const dx = Math.sin(frame * b.speed + b.phase) * 160;
        const dy = Math.cos(frame * b.speed * 1.3 + b.phase) * 110;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * width + dx - b.r / 2,
              top: b.y * height + dy - b.r / 2,
              width: b.r,
              height: b.r,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${b.color}38 0%, ${b.color}00 62%)`,
            }}
          />
        );
      })}
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.1}}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0H0V80" fill="none" stroke="#9fb2d6" strokeWidth="1" />
          </pattern>
          <radialGradient id="gm" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="gridmask">
            <rect width={width} height={height} fill="url(#gm)" />
          </mask>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" mask="url(#gridmask)" />
      </svg>
      {Array.from({length: 70}).map((_, i) => {
        const size = 2 + random(`s${i}`) * 5;
        const speed = 0.25 + random(`v${i}`) * 0.9;
        const x = random(`x${i}`) * width + Math.sin(frame * 0.02 + i) * 20;
        const y = (((random(`y${i}`) * height - frame * speed) % height) + height) % height;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.05 + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: '#fff',
              opacity: tw * 0.55,
              boxShadow: `0 0 ${size * 3}px ${C.cyan}`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 45%, #02040dcc 100%)'}} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
