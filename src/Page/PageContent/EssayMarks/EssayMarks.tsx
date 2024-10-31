import React from 'react';

import { useEssay } from '@store';

import OpacityBg from 'src/Page/_components/OpacityBg/OpacityBg';

import ParagraphComment from './ParagraphComment/ParagraphComment';
import BrightSpot from './BrightSpot/BrightSpot';
import SickExpression from './SickExpression/SickExpression';

import './EssayMarks.css';


export default function EssayMarks() {
  const { good_words, good_sents } = useEssay(store => store.essay);

  const menusHidden = [false, false, false];

  // console.log(good_sents.length, good_words.length);

  if (!good_sents.length && !good_words.length) {
    menusHidden[1] = true;
  }



  return (
      <div className="EssayMarks">
          {/* 还需努力 */}
          <div className="EssayMarks__item">
            <div className="EssayMarks__item__title">还需努力</div>
            <div className="EssayMarks__item__content">
              <SickExpression />
            </div>
          </div>

          {/* 作文亮点 */}
          <div className="EssayMarks__item">
            <div className="EssayMarks__item__title">作文亮点</div>
            <div className="EssayMarks__item__content">
              <BrightSpot />
            </div>
          </div>

          {/* 段落点评 */}
          <div className="EssayMarks__item">
            <div className="EssayMarks__item__title">段落点评</div>
            <div className="EssayMarks__item__content">
              <ParagraphComment />
            </div>
          </div>
      </div>
  );
}
