import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import { useBgVideo, useDisplayMode } from '@store';

import { GLOBAL_VOICE, VOICE_CNT } from 'src/request/textToSpeech';

import './Controls.css';

export default function Controls() {
  const toggleDisplay = useDisplayMode(display => display.toggleDisplayMode);
  const toggleVideo = useBgVideo(video => video.toggleVideo);
  const [voiceIdx, setVoiceIdx] = useState(GLOBAL_VOICE.voice + 1);
  const [voiceToggling, setVoiceToggling] = useState(false);

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
  }, [voiceIdx, cancelVoiceToggling]);

  return (
    <div className="Controls__wrapper">
      <div className="ToggleVideo" onClick={() => toggleVideo()}>
        <img src="images/icons/folder-video-fill.svg" alt=""></img>
      </div>
      <div className="ToggleVoice" onClick={() => toggleVoice(+1)}>
        <img src="images/icons/chat-voice-fill.svg" alt=""></img>
        <div
          className={`ToggleVoice__bubble ${voiceToggling ? 'ToggleVoice__bubble--toggling' : ''}`}>
          {voiceIdx}
        </div>
      </div>
      <div className="ToggleDisplay" onClick={() => toggleDisplay()}>
        <img src="images/icons/tv-2-fill.svg" alt=""></img>
      </div>
    </div>
  );
}
