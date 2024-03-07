import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import { GLOBAL_VOICE, VOICE_CNT } from 'src/request/textToSpeech';

import './BgVideo.css';

const VIDEO_NAMES = ['earth', 'DNA', 'heartbeat', 'tech'];

export default function BgVideo() {
  const [videoIdx, setVideoIdx] = useState<number>(0);
  const [voiceIdx, setVoiceIdx] = useState(GLOBAL_VOICE.voice + 1);
  const [voiceToggling, setVoiceToggling] = useState(false);

  function toggleVideo(idx: number) {
    setVideoIdx(idx);
  }

  function toggleVoice(diff: number) {
    GLOBAL_VOICE.voice = (GLOBAL_VOICE.voice + diff) % VOICE_CNT;
    setVoiceIdx(GLOBAL_VOICE.voice + 1);
  }

  const cancelVoiceToggling = useMemo(
    () =>
      debounce(() => {
        setVoiceToggling(false);
      }, 1000),
    []
  );

  useEffect(() => {
    setVoiceToggling(true);
    cancelVoiceToggling();
  }, [voiceIdx]);

  return (
    <div className="BgVideo__wrapper">
      <video
        className="BgVideo"
        controls={false}
        src={`videos/bg/${VIDEO_NAMES[videoIdx]}.mp4`}
        muted
        autoPlay
        loop></video>
      <div className="ToggleVideo" onClick={() => toggleVideo((videoIdx + 1) % VIDEO_NAMES.length)}>
        <img src="images/icons/folder-video-fill.svg" alt=""></img>
      </div>
      <div className="ToggleVoice" onClick={() => toggleVoice(+1)}>
        <img src="images/icons/chat-voice-fill.svg" alt=""></img>
        <div
          className={`ToggleVoice__bubble ${voiceToggling ? 'ToggleVoice__bubble--toggling' : ''}`}>
          {voiceIdx}
        </div>
      </div>
    </div>
  );
}
