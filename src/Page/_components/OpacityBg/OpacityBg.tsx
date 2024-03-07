import React, { type ReactNode } from 'react';

import './OpacityBg.css';

export default function OpacityBg({ children }: { children: ReactNode }) {
  return <div className="OpacityBg">{children}</div>;
}
