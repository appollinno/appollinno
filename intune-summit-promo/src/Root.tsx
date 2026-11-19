import React from 'react';
import {Composition, Folder} from 'remotion';
import {IntuneSummitPromo} from './IntuneSummitPromo';
import {Cta, Intro, Topics} from './Scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntuneSummitPromo"
        component={IntuneSummitPromo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Intro"
          component={Intro}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            style: {backgroundColor: '#0b1220', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'},
          }}
        />
        <Composition
          id="Topics"
          component={Topics}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            heading: 'Master modern device management',
            topics: 'Microsoft Intune|Copilot & AI|Endpoint Security',
            style: {backgroundColor: '#0b1220', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'},
          }}
        />
        <Composition
          id="Cta"
          component={Cta}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            line1: 'Save the date',
            line2: 'Intune Summit Moçambique 2026',
            style: {backgroundColor: '#10204a', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'},
          }}
        />
      </Folder>
    </>
  );
};
