import React from 'react';
import {Composition, Folder} from 'remotion';
import {IntuneSummitPromo} from './IntuneSummitPromo';
import {Cta, Intro, Topics} from './Scenes';
import {IntuneSummitEdicao1} from './IntuneSummitEdicao1';
import {IntuneSummitPremium} from './IntuneSummitPremium';
import {
  EdConditionalAccess,
  EdCopilot,
  EdCta,
  EdIntro,
  EdIntune,
  EdPim,
  EdSecurityCopilot,
} from './Edicao1';

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
      <Composition
        id="IntuneSummitPremium"
        component={IntuneSummitPremium}
        durationInFrames={1395}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntuneSummitEdicao1"
        component={IntuneSummitEdicao1}
        durationInFrames={990}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Edicao1-Cenas">
        <Composition
          id="Ed-Abertura"
          component={EdIntro}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-Intune"
          component={EdIntune}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-Copilot"
          component={EdCopilot}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-SecurityCopilot"
          component={EdSecurityCopilot}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-AcessoCondicional"
          component={EdConditionalAccess}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-PimJit"
          component={EdPim}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#0b1220'}}}
        />
        <Composition
          id="Ed-Encerramento"
          component={EdCta}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{style: {backgroundColor: '#10204a'}}}
        />
      </Folder>
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
