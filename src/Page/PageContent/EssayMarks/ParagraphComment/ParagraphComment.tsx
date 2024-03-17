import React from 'react';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';
import TypewriterAnimationForString from 'src/Page/_components/TypewriterAnimation/TypewriterAnimationForString';

import './ParagraphComment.css';

export default function ParagraphComment() {
  const paragraphComments = useEssay(store => store.essay.paragraphComments);

  const items = paragraphComments.map((comment, i) => (
    <div className="ParagraphComment__item" key={i}>
      <div className="ParagraphComment__locator">{i + 1}</div>
      <div>
        <TypewriterAnimationForString duration={1} text={comment}></TypewriterAnimationForString>
      </div>
    </div>
  ));

  return (
    <div className="ParagraphComment">
      <TypewriterAnimation duration={1} list={items}></TypewriterAnimation>
    </div>
  );
}
