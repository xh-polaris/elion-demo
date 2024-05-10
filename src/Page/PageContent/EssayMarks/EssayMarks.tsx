import React, { useState } from 'react';

import { useEssay } from '@store';

import OpacityBg from 'src/Page/_components/OpacityBg/OpacityBg';

import ParagraphComment from './ParagraphComment/ParagraphComment';
import BrightSpot from './BrightSpot/BrightSpot';
import SickExpression from './SickExpression/SickExpression';

import './EssayMarks.css';

const items = [
  {
    name: '还需努力',
    comp: <SickExpression></SickExpression>
  },
  {
    name: '作文亮点',
    comp: <BrightSpot></BrightSpot>
  },
  {
    name: '段落点评',
    comp: <ParagraphComment></ParagraphComment>
  }
];

export default function EssayMarks() {
  const [current, setCurrent] = useState(2);
  const { good_words, good_sents } = useEssay(store => store.essay);

  const menusHidden = [false, false, false];

  // console.log(good_sents.length, good_words.length);

  if (!good_sents.length && !good_words.length) {
    menusHidden[1] = true;
  }

  function toggleCurrent(idx: number) {
    setCurrent(idx);
  }

  return (
    <OpacityBg>
      <div className="EssayMarks">
        <div className="EssayMarks__menu EssayMarks__menu__background">
          {items.map((_, i) =>
            menusHidden[i] ? null : (
              <div
                className={`EssayMarks__menu__item__background EssayMarks__menu__item__background--${i} ${
                  i === current ? 'EssayMarks__menu__item__background--active' : ''
                }`}
                key={i}></div>
            )
          )}
        </div>
        <div className="EssayMarks__menu">
          {items.map(({ name }, i) =>
            menusHidden[i] ? null : (
              <div className="EssayMarks__menu__item" key={i} onClick={() => toggleCurrent(i)}>
                {name}
              </div>
            )
          )}
        </div>
        <div className="EssayMarks__content">{items[current].comp}</div>
      </div>
    </OpacityBg>
  );
}
