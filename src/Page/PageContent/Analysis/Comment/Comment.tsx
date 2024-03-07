import React, { useMemo } from 'react';

import { animationDurations, type HighlightRange } from '@def';
import { useDialog } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';
import OpacityBg from 'src/Page/_components/OpacityBg/OpacityBg';

import CommentAudio from './CommentAudio/CommentAudio';

import './Comment.css';

const ANIMATION_DURATION = animationDurations.comment;

function Comment({ content, highlights = [] }: { content: string; highlights?: HighlightRange[] }) {
  const callDialog = useDialog(state => state.toggleActive);
  const list = useMemo(() => {
    const chars = [] as string[];
    for (let i = 0; i < content.length; i++) {
      chars[i] = content[i];
    }
    const colors = [] as string[];
    highlights.forEach(({ start, length, color }) => {
      for (let i = 0; i < length; i++) {
        colors[start + i] = color;
      }
    });
    return chars.map((char, i) => (
      <span key={`${i} ${colors[i]}`} style={colors[i] ? { color: colors[i] } : {}}>
        {char}
      </span>
    ));
  }, [content, highlights]);

  return (
    <div className="CommentContent__wrapper">
      {list.length ? (
        <div className="CommentContent">
          <OpacityBg>
            <div className="CommentContent__interior">
              <TypewriterAnimation list={list} duration={ANIMATION_DURATION}></TypewriterAnimation>
            </div>
          </OpacityBg>
        </div>
      ) : null}
      <img
        src="images/logo/logo_fullBody.png"
        alt=""
        className="CommentContent__logo"
        onClick={() => callDialog()}></img>
      <CommentAudio content={content}></CommentAudio>
    </div>
  );
}

export default Comment;
