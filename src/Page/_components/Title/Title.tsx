import React from 'react';

import './Title.css';

interface Props {
  en?: string;
  zh: string;
}

export default function Title({ en, zh }: Props) {
  return (
    <div className="Title">
      <div className="Title__anchor Title__anchor--start"></div>
      <div className="Title__anchor Title__anchor--end"></div>
      <div className="Title__zh">{zh}</div>
      {en ? <div className="Title__en">{en}</div> : null}
    </div>
  );
}
