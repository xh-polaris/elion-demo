import React from 'react';

import TypewriterAnimationForString from 'src/Page/_components/TypewriterAnimation/TypewriterAnimationForString';

import './User.css';

export default function User({ input }: { input: string }) {
  return (
    <div className="Dialog__item">
      <div className="Dialog__content">
        <div className="User__content">
          <TypewriterAnimationForString text={input} duration={0.5}></TypewriterAnimationForString>
        </div>
      </div>
      <img src="images/icons/user-fill.svg" alt="" className="User__Logo"></img>
    </div>
  );
}
