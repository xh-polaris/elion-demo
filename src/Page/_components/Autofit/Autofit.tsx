/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { debounce } from 'lodash';

import { useDisplayMode } from '@store';

import './Autofit.css';

enum scaleMode {
  MIN = 0,
  MAX = 1
}

function Autofit({ children, mode = scaleMode.MIN }: { children: ReactNode; mode?: scaleMode }) {
  const displayMode = useDisplayMode(store => store.idx);
  const [scale, setScale] = useState<number>(1);
  const ref = useRef<HTMLDivElement>(null);

  const resizePage = () => {
    if (ref.current) {
      const widthRadio = document.body.clientWidth / ref.current?.clientWidth;
      const heightRadio = document.body.clientHeight / ref.current?.clientHeight;
      const targetScale =
        mode === scaleMode.MIN
          ? Math.min(widthRadio, heightRadio)
          : Math.max(widthRadio, heightRadio);
      setScale(targetScale);
    }
  };
  const debouncedResizePage = debounce(resizePage, 200);

  useEffect(() => {
    resizePage();
    window.addEventListener('resize', debouncedResizePage);

    return () => window.removeEventListener('resize', debouncedResizePage);
  });

  useEffect(() => {
    resizePage();
  }, [displayMode]);

  return (
    <div className="Autofit" style={{ transform: `scale(${scale})` }} ref={ref}>
      {children}
    </div>
  );
}

export default Autofit;
