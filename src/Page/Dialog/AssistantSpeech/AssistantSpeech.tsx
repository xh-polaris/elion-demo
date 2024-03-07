import { useRef, useEffect, useState } from 'react';

import { getSpeechResp, type Speech } from 'src/request/textToSpeech';

const sentenceLength = {
  max: 40,
  min: 20
};

const delimiterMarks = ['。', '？', '！', '；', '.', '?', '!', ';', '\n'];

const puntuationMarks = ['，', ','];

function splitAssistantResponse(resp: string) {
  const ret = [] as string[];
  let startIdx = 0;
  let endIdx;
  for (let i = 0; i < resp.length; i++) {
    endIdx = i + 1;
    const sentenceLen = endIdx - startIdx;
    const char = resp[i];
    if (
      (sentenceLen >= sentenceLength.min && delimiterMarks.includes(char)) ||
      (sentenceLen >= sentenceLength.max && puntuationMarks.includes(char))
    ) {
      ret.push(resp.slice(startIdx, endIdx));
      startIdx = endIdx;
    } else if (i === resp.length - 1) {
      ret.push(resp.slice(startIdx, endIdx));
    }
  }
  return { ret, finished: startIdx === endIdx };
}

export default function AssistantSpeech({ res, end }: { res: string; end: boolean }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const speeches = useRef<Speech[]>([]);
  const nextDownloadSpeechIdx = useRef(0);
  const nextPlaySpeechIdx = useRef(0);
  const speechPlayingFlag = useRef(false);
  const speechDownloadingFlag = useRef(false);
  const speechStopFlag = useRef(false);
  const { ret: texts, finished } = splitAssistantResponse(res);

  function playVoice(idx: number) {
    const speech = speeches.current[idx];
    if (!speechPlayingFlag.current && speech && nextPlaySpeechIdx.current === idx) {
      speechPlayingFlag.current = true;
      nextPlaySpeechIdx.current++;
      setAudioUrl(speech.url);
      setTimeout(() => {
        speechPlayingFlag.current = false;
        playVoice(idx + 1);
      }, speech.duration * 1000);
    }
  }

  function downloadVoice(i: number) {
    if (speechStopFlag.current) {
      return;
    }
    const text = texts[i];
    if (
      !speechDownloadingFlag.current &&
      text &&
      i === nextDownloadSpeechIdx.current &&
      (end || !(i === texts.length - 1 && !finished))
    ) {
      speechDownloadingFlag.current = true;
      getSpeechResp(text)
        .then(res => {
          speeches.current[i] = res;
          nextDownloadSpeechIdx.current++;
          downloadVoice(i + 1);
          playVoice(i);
        })
        .finally(() => {
          speechDownloadingFlag.current = false;
        });
    }
  }

  texts.forEach((_, i) => {
    downloadVoice(i);
  });

  useEffect(() => {
    speechStopFlag.current = false;
    return () => {
      speechStopFlag.current = true;
    };
  }, []);

  return audioUrl ? <audio src={audioUrl} autoPlay></audio> : null;
}
