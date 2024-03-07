import React, { useState, useEffect, useRef } from 'react';

import { useRecognition, RecognitionState } from '../audio/audioRecognizer';

import './Input.css';

const mic_icons = ['mic-2-line', 'mic-2-fill'];
const send_icons = ['send-plane-line', 'send-plane-fill'];

const SPEECH_RECOGNITION_AVALIABLE = navigator.userAgent.match('Edg/');

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
  const { controlReco, state, recognition } = useRecognition();

  const inputValue = `${text}${state === RecognitionState.speechstart ? recognition : ''}`;

  useEffect(() => {
    if (state === RecognitionState.end) {
      setText(t => `${t}${recognition}`);
    }
  }, [state]);

  const sendEnabled = text.length > 0 && !replying;

  function sendMessage(msg: string) {
    if (sendEnabled) {
      send(msg);
      setText('');
    }
  }

  return (
    <div className="Input">
      {SPEECH_RECOGNITION_AVALIABLE ? (
        <div
          className={`icon__wrapper icon--mic ${
            state === RecognitionState.speechstart ? 'icon--mic--enabled' : ''
          }`}
          onClick={controlReco}>
          <SwitchableIcon list={mic_icons} index={state === RecognitionState.speechstart ? 1 : 0} />
        </div>
      ) : null}

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
  );
}
