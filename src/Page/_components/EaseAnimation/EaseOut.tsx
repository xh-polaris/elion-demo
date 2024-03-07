import React, { type ReactNode } from 'react';

import './EaseAnimation.css';

export default function EaseOut({ children, trigger }: { children: ReactNode; trigger: boolean }) {
  if (trigger) {
    return <div className="EaseOut">{children}</div>;
  }
  return <div>{children}</div>;
}
