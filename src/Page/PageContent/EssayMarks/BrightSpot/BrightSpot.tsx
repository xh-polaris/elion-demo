import React, { useMemo, useEffect } from 'react';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';

import shortenSent from '../shortenSent';

import './BrightSpot.css';
import { useScrollToMark } from 'src/hooks/useScrollToMark';

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
  const selectedSentence = useEssay(store => store.selectedSentence);
  const setSelectedSentence = useEssay(store => store.setSelectedSentence);

  const goodWords = useMemo(() => {
    return good_words.map(({ paragraph_id, sent_id, start, end }) => (
      <div className="BrightSpot__goodWord" key={`${paragraph_id} ${sent_id}`}>
        <div className="BrightSpot__goodWord__title">好词</div>
        <div className="BrightSpot__goodWord__content">
          {sents[paragraph_id][sent_id].substring(start, end)}
        </div>
      </div>
    ));
  }, [good_words, sents]);

  const goodSentsList = useMemo(() => {
    return good_sents_arranged.map((goodSentsInParagraph, paragraphId) => (
      <div className="BrightSpot__goodSents__wrapper" key={paragraphId}>
        {goodSentsInParagraph.map((goodSent, sentId) => (          
          <div 
            className="BrightSpot__goodSent"
            data-paragraph-id={paragraphId}
            data-sent-id={sentId}
            onClick={() => setSelectedSentence(paragraphId, sentId)}
            key={sentId}
          >
            <div className="BrightSpot__goodSent__title">好句</div>
            <div className="BrightSpot__goodSent__content">
              <div className="BrightSpot__goodSent__text">
                {shortenSent(sents[paragraphId][sentId])}
              </div>
              <div className="BrightSpot__rehetoric">
                {judgeRhetoric(goodSent.label)}
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  }, [good_sents_arranged, sents, setSelectedSentence]);

  useEffect(() => {
    document.querySelectorAll('.BrightSpot__goodSent').forEach(el => {
      const paragraphId = Number(el.getAttribute('data-paragraph-id'));
      const sentId = Number(el.getAttribute('data-sent-id'));
      
      if (selectedSentence?.paragraphId === paragraphId && 
          selectedSentence?.sentId === sentId) {
        el.classList.add('BrightSpot__goodSent--selected');
      } else {
        el.classList.remove('BrightSpot__goodSent--selected');
      }
    });
  }, [selectedSentence]);

  useScrollToMark(selectedSentence, '.BrightSpot__goodSent', '.BrightSpot');

  return (
    <div className="BrightSpot">
      <TypewriterAnimation duration={1} list={goodWords} key="goodWords" />
      <TypewriterAnimation duration={1} list={goodSentsList} key="goodSents" />
    </div>
  );
}
