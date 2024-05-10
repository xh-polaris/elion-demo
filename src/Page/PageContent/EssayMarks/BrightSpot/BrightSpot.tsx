import React from 'react';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';
import TypewriterAnimationForString from 'src/Page/_components/TypewriterAnimation/TypewriterAnimationForString';

import shortenSent from '../shortenSent';

import './BrightSpot.css';

export function judgeRhetoric(label: string) {
  switch (label) {
    case '0':
      return '';
    case '1':
      return '比喻';
    case '2':
      return '拟人';
    case '3':
      return '排比';
  }
  return '';
}

export default function BrightSpot() {
  const { good_words, good_sents_arranged, sents } = useEssay(store => store.essay);

  const goodWords = good_words.map(({ paragraph_id, sent_id, start, end }) => (
    <div className="BrightSpot__goodWord" key={`${paragraph_id} ${sent_id}`}>
      {sents[paragraph_id][sent_id].substring(start, end)}
    </div>
  ));

  const goodSents = good_sents_arranged.map((goodSentsInParagraph, paragraphId) => (
    <div className="BrightSpot__goodSents__wrapper" key={paragraphId}>
      {goodSentsInParagraph.map((goodSent, sentId) => (
        <div className="BrightSpot__goodSent" key={sentId}>
          <TypewriterAnimationForString
            duration={1}
            text={shortenSent(sents[paragraphId][sentId])}></TypewriterAnimationForString>
          <span className="BrightSpot__rehetoric">{judgeRhetoric(goodSent.label)}</span>
        </div>
      ))}
    </div>
  ));

  return (
    <div className="BrightSpot">
      {goodWords.length ? <div className="BrightSpot__Title">好词</div> : null}
      <TypewriterAnimation duration={1} list={goodWords}></TypewriterAnimation>
      {goodSents.length ? (
        <div className="BrightSpot__Title BrightSpot__Title--goodSent">好句</div>
      ) : null}
      <TypewriterAnimation duration={1} list={goodSents}></TypewriterAnimation>
    </div>
  );
}
