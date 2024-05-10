import React, { useState, useEffect, useRef } from 'react';

import { useRecognition, RecognitionState } from '../audio/audioRecognizer';
import { useTranscribe } from '../audio/audioRecorder';

import './Input.css';

const mic_icons = ['mic-2-line', 'mic-2-fill'];
const send_icons = ['send-plane-line', 'send-plane-fill'];

let SPEECH_RECOGNITION_AVALIABLE = (function () {
  if (!((window as any).webkitSpeechRecognition || (window as any).speechRecognition)) {
    return false;
  }
  return true;
})();

// let UA = navigator.userAgent;

function SwitchableIcon({ list, index }: { list: string[]; index: number }) {
  return <img src={`images/icons/${list[index]}.svg`} alt=""></img>;
}

export default function Input({
  send,
  replying
}: {
  send: (input: string) => void;
  replying: boolean;
}) {
  const texts = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>('');
  // const [ok, setOk] = useState<any>();
  // const [error, setError] = useState<any>();
  const {
    controlReco,
    state,
    result: recognition
  } = (SPEECH_RECOGNITION_AVALIABLE ? useRecognition : useTranscribe)();

  //(SPEECH_RECOGNITION_AVALIABLE ? useRecognition : useTranscribe)();

  const inputValue = `${text}${state === RecognitionState.speechstart ? recognition : ''}`;

  useEffect(() => {
    if (state === RecognitionState.end) {
      setText(t => `${t}${recognition}`);
    }
  }, [state]);

  // useEffect(() => {
  //   if (SPEECH_RECOGNITION_AVALIABLE) {
  //     const recognition = (window as any).webkitSpeechRecognition
  //       ? new (window as any).webkitSpeechRecognition()
  //       : new (window as any).speechRecognition();

  //     recognition.start();

  //     setTimeout(() => {
  //       recognition.stop();
  //     }, 500);

  //     recognition.onerror = (e: any) => {
  //       console.log(e.error);
  //       if (e.error === 'network') {
  //         // SPEECH_RECOGNITION_AVALIABLE = false;

  //         console.log('Speech API Unavaliable : Network Error');
  //       }
  //       setOk(false);
  //       setError(e.error);
  //     };

  //     recognition.onresult = () => {
  //       setOk(true);
  //     };
  //     return () => recognition.abort();
  //   }
  // }, []);

  const sendEnabled = text.length > 0 && !replying;

  function sendMessage(msg: string) {
    if (sendEnabled) {
      send(msg);
      setText('');
    }
  }

  return (
    <>
      {/* <>
        {' '}
        <div>User Agent : {UA}</div>
        <div>-------------------------------------------------</div>
        <div>可用 : {SPEECH_RECOGNITION_AVALIABLE.toString()}</div>
        {SPEECH_RECOGNITION_AVALIABLE ? (
          <div>可访问 : {ok === undefined ? '检测中......' : ok.toString()}</div>
        ) : null}
        {SPEECH_RECOGNITION_AVALIABLE && error ? <div>访问错误: {error}</div> : null}
      </> */}
      <div className="Input">
        <div
          className={`icon__wrapper icon--mic ${
            state === RecognitionState.speechstart ? 'icon--mic--enabled' : ''
          }`}
          onClick={controlReco}>
          <SwitchableIcon list={mic_icons} index={state === RecognitionState.speechstart ? 1 : 0} />
        </div>

        <textarea
          className="Input__box"
          value={inputValue}
          ref={texts}
          readOnly={state === RecognitionState.speechstart}
          onChange={e => {
            const val = e.target.value;
            if (val.includes('\n')) {
              sendMessage(val);
            } else {
              setText(e.target.value);
            }
          }}></textarea>
        <div className="icon__wrapper icon--send" onClick={() => sendMessage(text)}>
          <SwitchableIcon list={send_icons} index={sendEnabled ? 1 : 0} />
        </div>
      </div>
    </>
  );
}
