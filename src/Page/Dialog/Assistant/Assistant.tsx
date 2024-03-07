import React, { type ReactNode } from 'react';

import './Assistant.css';

export default function Assistant({ children }: { children: ReactNode | null }) {
  return (
    <div className="Dialog__item">
      <img src="images/logo/logo.png" alt="" className="Assistant__Logo"></img>
      <div className="Dialog__content Dialog__content--assistant">{children}</div>
    </div>
  );
}
