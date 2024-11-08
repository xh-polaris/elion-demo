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
      <img className="Title__icon" src="/images/icons/right.svg" alt=""></img>
    </div>
  );
}
