import React from 'react';
import { Composition } from 'remotion';
import {
  PopVideoComposition,
  POP_VIDEO_DURATION_FRAMES,
  POP_VIDEO_FPS,
} from './PopVideoComposition';
import { POPS_DATA } from '../data/pops';

export const RemotionRoot: React.FC = () => {
  const mainPop = POPS_DATA[0];

  return (
    <>
      <Composition
        id="PreventivaTotem-16x9"
        component={PopVideoComposition as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={POP_VIDEO_DURATION_FRAMES}
        fps={POP_VIDEO_FPS}
        width={1280}
        height={720}
        defaultProps={{
          pop: mainPop,
          aspect: '16:9',
        }}
      />
      <Composition
        id="PreventivaTotem-9x16"
        component={PopVideoComposition as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={POP_VIDEO_DURATION_FRAMES}
        fps={POP_VIDEO_FPS}
        width={720}
        height={1280}
        defaultProps={{
          pop: mainPop,
          aspect: '9:16',
        }}
      />
      {POPS_DATA.map((pop) => (
        <React.Fragment key={pop.id}>
          <Composition
            id={`${pop.id}-16x9`}
            component={PopVideoComposition as unknown as React.FC<Record<string, unknown>>}
            durationInFrames={POP_VIDEO_DURATION_FRAMES}
            fps={POP_VIDEO_FPS}
            width={1280}
            height={720}
            defaultProps={{
              pop,
              aspect: '16:9',
            }}
          />
          <Composition
            id={`${pop.id}-9x16`}
            component={PopVideoComposition as unknown as React.FC<Record<string, unknown>>}
            durationInFrames={POP_VIDEO_DURATION_FRAMES}
            fps={POP_VIDEO_FPS}
            width={720}
            height={1280}
            defaultProps={{
              pop,
              aspect: '9:16',
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
