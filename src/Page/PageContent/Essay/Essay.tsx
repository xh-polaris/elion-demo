import React, { useMemo, useState, useRef } from 'react';
import { Popover } from 'antd';
import { throttle } from 'lodash';

import { useEssay } from '@store';
import { animationDurations } from '@def';

import OpacityBg from '../../_components/OpacityBg/OpacityBg';

import TypewriterAnimation from '../../_components/TypewriterAnimation/TypewriterAnimation';
import ParagraphCommentNotation from './ParagraphCommentNotation/ParagraphCommentNotation';

import { judgeRhetoric } from '../EssayMarks/BrightSpot/BrightSpot';

import { GRID_ROWS, ROW_HEIGHT, GRID_COLS } from './constants';

import './Essay.css';

const ANIMATION_DURATION = animationDurations.essay;

function Essay() {
  const {
    title,
    sents,
    id,
    lines,
    author,
    paragraphComments,
    good_sents_arranged,
    sick_sents_arranged,
    good_words_arranged
  } = useEssay(state => state.essay);
  const selectedSentence = useEssay(store => store.selectedSentence);
  const setSelectedSentence = useEssay(store => store.setSelectedSentence);
  const clearSelectedSentence = useEssay(store => store.clearSelectedSentence);
  const [currLine, setCurrLine] = useState<number>(0);
  const scroller = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => {
    const res = [] as JSX.Element[];
    sents.forEach((paragraph, i) => {
      res.push(
        <div key={`para-num-${i}`} className="Essay__text Essay__paragraph-number">
          {i + 1}.
        </div>
      );
      
      res.push(
        <div key={`indent-${i}-1`} className="Essay__text">
          <div className="Essay__char">&nbsp;</div>
        </div>
      );

      paragraph.forEach((sentence, j) => {
        const isSelected = selectedSentence?.paragraphId === i && 
                          selectedSentence?.sentId === j;
        
        sentence.split('').forEach((char, k) => {
          const goodWords = (good_words_arranged[i] ? good_words_arranged[i][j] : null) ?? [];
          const goodSent = good_sents_arranged[i] ? good_sents_arranged[i][j] : null;
          const sickSent = sick_sents_arranged[i] ? sick_sents_arranged[i][j] : null;

          let isInGoodWord = false;

          for (let i = 0; i < goodWords.length; i++) {
            let goodWord = goodWords[i];
            if (k < goodWord.start) {
              break;
            } else if (k < goodWord.end) {
              isInGoodWord = true;
              break;
            }
          }

          const Inner = (
            <div 
              className={`Essay__text ${isSelected ? 'Essay__text--selected' : ''}`}
              onClick={() => setSelectedSentence(i, j)}
              key={`${i} ${j} ${k}`}
            >
              {isInGoodWord ? <div className="Essay__textDecorator--goodWord"></div> : null}
              {goodSent ? (
                <div
                  className={
                    'Essay__textDecorator--goodSent ' +
                    (k === sentence.length - 1 ? 'Essay__textDecorator--divider' : '')
                  }></div>
              ) : null}
              {sickSent ? (
                <div
                  className={
                    'Essay__textDecorator--sickSent ' +
                    (k === sentence.length - 1 ? 'Essay__textDecorator--divider' : '')
                  }></div>
              ) : null}
              <div className="Essay__char">{char}</div>
            </div>
          );
          res.push(
            sickSent || goodSent ? (
              <Popover
                key={`popover ${i} ${j} ${k}`}
                content={
                  <div>
                    {goodSent ? (
                      <div className="Essay__popover__content--good">
                        {judgeRhetoric(goodSent.label)}
                      </div>
                    ) : null}
                    {sickSent ? (
                      <div className="Essay__popover__content--sick">{sickSent.label}</div>
                    ) : null}
                  </div>
                }>
                {Inner}
              </Popover>
            ) : (
              Inner
            )
          );
        });
      });

      res.push(
        <div key={`break-${i}`} className="Essay__break">
          <br />
        </div>
      );
    });
    return res;
  }, [sents, selectedSentence]);

  const throttledScrollRecorder = useMemo(() => {
    function scrollRecorder(e: React.UIEvent<HTMLDivElement, WheelEvent>) {
      setCurrLine(Math.floor((e.target as any).scrollTop / ROW_HEIGHT));
    }
    return throttle(scrollRecorder, 500);
  }, []);

  function scrollLines(line: number) {
    scroller.current?.scrollBy(0, line * ROW_HEIGHT);
  }

  return (
    <div className="Essay">
      <div className="Essay__title">
        {/*
        {author.name ? (
          <div className="Essay__author">
            {author.class} {author.name}
          </div>
        ) : null}*/}
        <div className="Essay__titleText">{title}</div>
      </div>
      <OpacityBg>
        <div className="Essay__content">
          <div className="Essay__grid" onScroll={throttledScrollRecorder} ref={scroller}>
            <div key={id} className="Essay__texts--srcoller">
              {/* <div className="Essay__lines">
                {new Array(Math.max(GRID_ROWS, lines)).fill(0).map((_, i) => (
                  <div className="Essay__line" key={i}></div>
                ))}
              </div> */}
              <div className="Essay__texts">
                <TypewriterAnimation
                  list={chars}
                  duration={ANIMATION_DURATION}></TypewriterAnimation>
              </div>
            </div>
          </div>
          <img
            className={`Scroll__icon Scroll__icon--up ${
              currLine === 0 ? 'Scroll__icon--invisible' : ''
            }`}
            src="images/icons/reply-fill.svg"
            alt=""
            onClick={() => scrollLines(-1)}></img>
          <img
            className={`Scroll__icon ${
              currLine >= Math.max(lines - GRID_ROWS, 0) ? 'Scroll__icon--invisible' : ''
            }`}
            src="images/icons/reply-fill.svg"
            alt=""
            onClick={() => scrollLines(1)}></img>
        </div>
      </OpacityBg>
    </div>
  );
}

export default Essay;
