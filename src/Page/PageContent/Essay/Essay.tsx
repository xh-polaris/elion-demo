import React, { useMemo, useState, useRef } from 'react';
import { Popover } from 'antd';
import { throttle } from 'lodash';

import { useEssay } from '@store';
import { animationDurations } from '@def';

import OpacityBg from '../../_components/OpacityBg/OpacityBg';

import TypewriterAnimation from '../../_components/TypewriterAnimation/TypewriterAnimation';
import ParagraphComment from './ParagraphComment/ParagraphComment';

import { GRID_ROWS, ROW_HEIGHT, GRID_COLS } from './constants';

import './Essay.css';

const ANIMATION_DURATION = animationDurations.essay;

function Essay() {
  const {
    title,
    sents,
    id,
    lines,
    paragraphComments,
    good_sents_arranged,
    sick_sents_arranged,
    good_words_arranged
  } = useEssay(state => state.essay);
  const [currLine, setCurrLine] = useState<number>(0);
  const scroller = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => {
    const res = [] as JSX.Element[];
    // let colCounter = 0;
    // function accumulateCol(diff: number = 1) {
    //   colCounter += diff;
    //   colCounter %= GRID_COLS;
    // }
    function addLineStarts(i: number) {
      res.push(<div className="Essay__text" key={`lineStart0 ${i}`}></div>);
      res.push(<div className="Essay__text" key={`lineStart1 ${i}`}></div>);
    }
    function addEssayBreak(i: number) {
      res.push(
        <div className="Essay__break" key={`break ${i}`}>
          <ParagraphComment comment={paragraphComments[i]} pos={i % 2 ? true : false} />
        </div>
      );
    }
    sents.forEach((paragraph, i) => {
      addLineStarts(i);
      paragraph.forEach((sentence, j) => {
        for (let k = 0; k < sentence.length; k++) {
          const goodWord = good_words_arranged[i] ? good_words_arranged[i][j] : null;
          const goodSent = good_sents_arranged[i] ? good_sents_arranged[i][j] : null;
          const sickSent = sick_sents_arranged[i] ? sick_sents_arranged[i][j] : null;

          const Inner = (
            <div className="Essay__text" key={`${i} ${j} ${k}`}>
              {goodWord && k >= goodWord.start && k < goodWord.end ? (
                <div className="Essay__textDecorator--goodWord"></div>
              ) : null}
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
              <div className="Essay__char">{sentence[k]}</div>
            </div>
          );
          res.push(sickSent ? <Popover content={sickSent.label}>{Inner}</Popover> : Inner);
        }
      });
      addEssayBreak(i);
    });
    return res;
  }, [id]);

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
      <div className="Essay__title">{title}</div>
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
