import React, { type ReactNode } from 'react';

import './EaseAnimation.css';

export default function EaseIn({ children }: { children: ReactNode }) {
  return <div className="EaseIn">{children}</div>;
}
