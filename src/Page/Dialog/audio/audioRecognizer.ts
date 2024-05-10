import { useState, useRef } from 'react';

export enum RecognitionState {
  initial,
  speechstart,
  end
}

export function useRecognition() {
  const [state, setState] = useState<RecognitionState>(RecognitionState.initial);
  const [result, setResult] = useState<string>('');
  const reco = useRef<any>();

  function startReco() {
    setState(RecognitionState.initial);
    setResult('');
    const recognition = (window as any).webkitSpeechRecognition
      ? new (window as any).webkitSpeechRecognition()
      : new (window as any).speechRecognition();
    reco.current = recognition;
    recognition.lang = 'zh-CN';
    // recognition.continuous = true;
    recognition.interimResults = true;

    recognition.start();

    recognition.onspeechstart = (event: any) => {
      setState(RecognitionState.speechstart);
    };

    recognition.onresult = (event: any) => {
      const results = event.results as SpeechRecognitionResultList;
      const input = results[0][0].transcript;
      setResult(input);
      // recognition.onresult = null;
    };

    recognition.onend = (event: any) => {
      recognition.onresult = null;
      setState(RecognitionState.end);
    };

    recognition.onerror = (e: any) => {
      console.log(e);
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

  return { controlReco, startReco, stopReco, result, state };
}
