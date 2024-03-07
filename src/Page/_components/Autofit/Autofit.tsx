import React, { useState, useEffect, ReactNode } from 'react';
import { debounce } from 'lodash';

import './Autofit.css';

const PAGE_ACTUAL_WIDTH = 1920;
const PAGE_ACTUAL_HEIGHT = 1080;

function Autofit({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const resizePage = () => {
      setScale(
        Math.min(
          document.body.clientWidth / PAGE_ACTUAL_WIDTH,
          document.body.clientHeight / PAGE_ACTUAL_HEIGHT
        )
      );
    };
    const debouncedResizePage = debounce(resizePage, 500);

    resizePage();
    window.addEventListener('resize', debouncedResizePage);

    return () => window.removeEventListener('resize', debouncedResizePage);
  });

  return (
    <div className="Autofit" style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
}

export default Autofit;
