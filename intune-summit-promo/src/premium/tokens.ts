export const C = {
  bg: '#040815',
  ink: '#ffffff',
  mute: '#9fb2d6',
  blue: '#2f8cff',
  cyan: '#2fe0ff',
  violet: '#8b5cf6',
  pink: '#ff5fa2',
  gold: '#ffd23f',
  green: '#22c58b',
  red: '#ff4d6d',
} as const;

export const FONT = 'Inter, Segoe UI, Helvetica, Arial, sans-serif';

export const gradText = {
  background: `linear-gradient(100deg, #ffffff 0%, ${C.cyan} 42%, ${C.violet} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;

export const LOGOS = {
  intune: 'logos/microsoft-intune.svg',
  m365: 'logos/microsoft-365.svg',
  purview: 'logos/microsoft-purview.svg',
  defender: 'logos/microsoft-defender.svg',
  copilot: 'logos/microsoft-copilot.svg',
  azure: 'logos/microsoft-azure.svg',
  entra: 'logos/microsoft-entra.svg',
} as const;
