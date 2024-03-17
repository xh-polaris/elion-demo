import React from 'react';
import { Popover } from 'antd';

import TypewriterAnimationForString from 'src/Page/_components/TypewriterAnimation/TypewriterAnimationForString';

import './ParagraphCommentNotation.css';

export default function ParagraphCommentNotation({
  idx,
  comment
}: {
  idx: number;
  comment: string;
}) {
  return (
    <div className="ParagraphCommentNotation">
      <Popover
        title={
          <div className="ParagraphCommentNotation__comment">
            <TypewriterAnimationForString
              text={comment}
              duration={1}></TypewriterAnimationForString>
          </div>
        }
        placement={'leftTop'}>
        <div className={`ParagraphComment__locator`}>{idx + 1}</div>
      </Popover>
    </div>
  );
}
