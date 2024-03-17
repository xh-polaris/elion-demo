import React from 'react';

import { useEssay } from '@store';

import './TextToVideo.css';

export default function TextToVideo() {
  const { id } = useEssay(state => state.essay);

  if (id === -1) {
    return <div className="TextToVideo"></div>;
  }

  return (
    <div className="TextToVideo">
      <div className="TextToVideo__wrapper">
        <video
          className="TextToVideo__video"
          src={`videos/textToVideo/${id}.mp4 `}
          controls></video>
      </div>
    </div>
  );
}
