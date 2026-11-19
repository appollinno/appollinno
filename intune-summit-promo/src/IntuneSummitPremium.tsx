import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Background} from './premium/Background';
import {SceneAdmin, SceneDate, SceneEcosystem, SceneIntro, SceneScore} from './premium/scenes1';
import {
  SceneAccess,
  SceneCopilot,
  SceneFinal,
  ScenePim,
  SceneSecurityCopilot,
  SceneZeroTrust,
} from './premium/scenes2';

const T = linearTiming({durationInFrames: 15});

export const IntuneSummitPremium: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Audio name="Música" src={staticFile('music.mp3')} volume={0.9} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneDate />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={T} />
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneEcosystem />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={150}>
        <SceneAdmin />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={T} />
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneScore />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={120}>
        <SceneZeroTrust />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={T} />
      <TransitionSeries.Sequence durationInFrames={150}>
        <SceneAccess />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={135}>
        <ScenePim />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={T} />
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneCopilot />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneSecurityCopilot />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={150}>
        <SceneFinal />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
