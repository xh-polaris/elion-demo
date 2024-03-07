import React, { useState, useEffect, useRef } from 'react';

import { useDialog } from '@store';

import Mask from './Mask/Mask';
import Assistant from './Assistant/Assistant';
import User from './User/User';
import Input from './Input/Input';
import AssistantSpeech from './AssistantSpeech/AssistantSpeech';
import WelcomeSpeech, { WELCOME_TEXT } from './WelcomeSpeech/WelcomeSpeech';

import EaseIn from '../_components/EaseAnimation/EaseIn';
import TypewriterAnimationForString from '../_components/TypewriterAnimation/TypewriterAnimationForString';

import { useChatResp } from './chat/useChat';

import './Dialog.css';

function DialogContent() {
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [assistantReplys, setAssistantReplys] = useState<string[]>([]);
  const { res, get, replying, chatIdx } = useChatResp();
  const scroller = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }

  function send(input: string) {
    setUserInputs(inputs => [...inputs, input]);
    get(input);
  }

  useEffect(() => {
    if (!replying && res) {
      setAssistantReplys(replys => [...replys, res]);
    }
  }, [replying]);

  useEffect(() => {
    scrollToBottom();
  }, [res, userInputs]);

  return (
    <div className="Dialog__locator">
      <EaseIn>
        <div className="Dialog">
          <div className="Dialog__scroller" ref={scroller}>
            <div className="Dialog__wrapper">
              <Assistant key={-1}>
                <TypewriterAnimationForString
                  text={WELCOME_TEXT}
                  duration={1}></TypewriterAnimationForString>
              </Assistant>
              {userInputs.map((input, i) => (
                <React.Fragment key={i}>
                  <User input={input} />
                  {assistantReplys[i] ? <Assistant>{assistantReplys[i]}</Assistant> : null}
                </React.Fragment>
              ))}
              {replying && res ? <Assistant key={-2}>{res}</Assistant> : null}
            </div>
          </div>
          <Input send={send} replying={replying}></Input>
        </div>
      </EaseIn>
      {chatIdx >= 0 ? (
        <AssistantSpeech key={chatIdx} res={res} end={!replying}></AssistantSpeech>
      ) : (
        <WelcomeSpeech></WelcomeSpeech>
      )}
    </div>
  );
}

export default function Dialog() {
  const { active } = useDialog(state => state);

  if (!active) {
    return null;
  }

  return (
    <>
      <Mask></Mask>
      <DialogContent></DialogContent>
    </>
  );
}
