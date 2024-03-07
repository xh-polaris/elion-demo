import React, { useEffect, useRef, useState } from 'react';

import { useEssay } from '@store';

import { useSpeechResp } from 'src/request/textToSpeech';

import './CommentAudio.css';

function Comment({ content }: { content: string }) {
  const { id } = useEssay(state => state.essay);
  const viewIdx = useEssay(state => state.viewIdx);

  const { res, get, loading } = useSpeechResp();

  const playing = useRef(false);
  useEffect(() => {
    function stopPlaying() {
      res?.audio.pause();
      playing.current = false;
    }
    if (res && res.audio) {
      playing.current = true;
      res.audio.play();
      const timeout = setTimeout(() => {
        stopPlaying();
      }, res.duration * 1000);
      return () => {
        stopPlaying();
        clearTimeout(timeout);
      };
    }
  }, [res]);

  const [loadingAnime, setLoadingAnime] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => [setLoadingAnime(loading)], 500);
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className="CommentAudio">
      <img
        src="images/icons/refresh-line.svg"
        alt=""
        className={`Icon__loading ${content && loadingAnime ? '' : 'Icon--invisible'}`}></img>

      <img
        src="images/icons/voiceprint-fill.svg"
        alt=""
        className={`Icon__voice ${content ? '' : 'Icon--invisible'}`}
        onClick={() => {
          if (!loading && !playing.current) {
            get(`${id}_${viewIdx}`, content);
          }
        }}></img>
    </div>
  );
}

export default Comment;
