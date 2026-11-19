import React from 'react';
import {Track, useVideoConfig} from 'remotion';
import {Cta, Intro, Topics} from './Scenes';
import {colors} from './theme';

const centered: React.CSSProperties = {
  backgroundColor: colors.bg,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

export const IntuneSummitPromo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <Track name="Scenes">
      <Intro name="Intro" durationInFrames={5 * fps} style={centered} />
      <Topics
        name="Topics"
        from={5 * fps}
        durationInFrames={5 * fps}
        heading="Master modern device management"
        topics="Microsoft Intune|Copilot & AI|Endpoint Security"
        style={centered}
      />
      <Cta
        name="Call to action"
        from={10 * fps}
        durationInFrames={5 * fps}
        line1="Save the date"
        line2="Intune Summit Moçambique 2026"
        style={{...centered, backgroundColor: colors.bgAlt}}
      />
    </Track>
  );
};
