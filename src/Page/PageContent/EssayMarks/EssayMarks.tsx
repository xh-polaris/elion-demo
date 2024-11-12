import React from 'react';

import { useEssay } from '@store';


import ParagraphComment from './ParagraphComment/ParagraphComment';
import BrightSpot from './BrightSpot/BrightSpot';
import SickExpression from './SickExpression/SickExpression';

import './EssayMarks.css';


export default function EssayMarks() {
  const { id } = useEssay(store => store.essay);

  // 使用 key={id} 确保只在文章切换时重新渲染
  return (
    <div className="EssayMarks" key={id}>
      <div className="EssayMarks__item">
        <div className="EssayMarks__item__title">还需努力</div>
        <div className="EssayMarks__divider"/>
        <div className="EssayMarks__item__content">
          <SickExpression />
        </div>
      </div>

      <div className="EssayMarks__item">
        <div className="EssayMarks__item__title">作文亮点</div>
        <div className="EssayMarks__divider"/>
        <div className="EssayMarks__item__content">
          <BrightSpot />
        </div>
      </div>

      <div className="EssayMarks__item">
        <div className="EssayMarks__item__title">段落点评</div>
        <div className="EssayMarks__divider"/>
        <div className="EssayMarks__item__content">
          <ParagraphComment />
        </div>
      </div>
    </div>
  );
}
