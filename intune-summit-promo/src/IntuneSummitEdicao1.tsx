import React from 'react';
import {Track, useVideoConfig} from 'remotion';
import {
  EdConditionalAccess,
  EdCopilot,
  EdCta,
  EdIntro,
  EdIntune,
  EdPim,
  EdSecurityCopilot,
} from './Edicao1';
import {colors} from './theme';

export const IntuneSummitEdicao1: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <Track name="Cenas">
      <EdIntro name="Abertura" durationInFrames={4 * fps} style={{backgroundColor: colors.bg}} />
      <EdIntune name="Intune" from={4 * fps} durationInFrames={5 * fps} style={{backgroundColor: colors.bg}} />
      <EdCopilot name="Copilot" from={9 * fps} durationInFrames={5 * fps} style={{backgroundColor: colors.bg}} />
      <EdSecurityCopilot name="Security Copilot" from={14 * fps} durationInFrames={5 * fps} style={{backgroundColor: colors.bg}} />
      <EdConditionalAccess name="Acesso Condicional" from={19 * fps} durationInFrames={5 * fps} style={{backgroundColor: colors.bg}} />
      <EdPim name="PIM JIT" from={24 * fps} durationInFrames={5 * fps} style={{backgroundColor: colors.bg}} />
      <EdCta name="Encerramento" from={29 * fps} durationInFrames={4 * fps} style={{backgroundColor: colors.bgAlt}} />
    </Track>
  );
};
