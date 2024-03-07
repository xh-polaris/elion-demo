import React from 'react';
import { Popover } from 'antd';

import TypewriterAnimationForString from 'src/Page/_components/TypewriterAnimation/TypewriterAnimationForString';

import './ParagraphComment.css';

export default function ParagraphComment({ comment, pos }: { comment: string; pos: boolean }) {
  return (
    <div className="ParagraphComment">
      <Popover
        title={
          <div className="ParagraphComment__comment">
            <TypewriterAnimationForString
              text={comment}
              duration={1}></TypewriterAnimationForString>
          </div>
        }
        placement={pos ? 'leftTop' : 'rightTop'}>
        <div
          className={`ParagraphComment__locator ${
            pos ? 'ParagraphComment__locator--left' : 'ParagraphComment__locator--right'
          }`}></div>
      </Popover>
    </div>
  );
}
