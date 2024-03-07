import React, { useMemo } from 'react';

import TypewriterAnimation from './TypewriterAnimation';

export default function TypewriterAnimationForString({
  text,
  duration
}: {
  text: string;
  duration: number;
}) {
  const list = useMemo(() => {
    const list = [] as JSX.Element[];
    for (let i = 0; i < text.length; i++) {
      list.push(
        <span key={`${i} ${text[i]}`} style={{ whiteSpace: 'pre' }}>
          {text[i]}
        </span>
      );
    }
    return list;
  }, [text]);
  return <TypewriterAnimation list={list} duration={duration}></TypewriterAnimation>;
}
