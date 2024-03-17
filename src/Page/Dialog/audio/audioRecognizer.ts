import { useState, useRef } from 'react';

export enum RecognitionState {
  initial,
  speechstart,
  end
}

export function useRecognition() {
  const [state, setState] = useState<RecognitionState>(RecognitionState.initial);
  const [recognition, setRecognition] = useState<string>('');
  const reco = useRef<any>('');

  function startReco() {
    setState(RecognitionState.initial);
    setRecognition('');
    const recognition = new (window as any).webkitSpeechRecognition();
    reco.current = recognition;
    recognition.lang = 'zh-CN';
    // recognition.continuous = true;
    recognition.interimResults = true;
    // console.log(recognition);

    recognition.start();

    recognition.onspeechstart = (event: any) => {
      setState(RecognitionState.speechstart);
    };

    recognition.onresult = (event: any) => {
      const results = event.results as SpeechRecognitionResultList;
      const input = results[0][0].transcript;
      setRecognition(input);
      // recognition.onresult = null;
    };

    recognition.onend = (event: any) => {
      recognition.onresult = null;
      setState(RecognitionState.end);
    };
  }

  function stopReco() {
    reco.current.stop();
  }

  function controlReco() {
    if (state === RecognitionState.speechstart) {
      stopReco();
    } else {
      startReco();
    }
  }

  return { controlReco, startReco, stopReco, recognition, state };
}
