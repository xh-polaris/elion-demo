import React, { useState, useEffect, useRef } from 'react';

import { useEssay } from '@store';

import './TextToImage.css';

export default function TextToImage() {
  const { id } = useEssay(state => state.essay);
  const [active, setActive] = useState<number>(0);
  const clicked = useRef(false);

  function toggleImg() {
    setActive((active + 1) % 4);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!clicked.current) {
        toggleImg();
      } else {
        clicked.current = false;
      }
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (id === -1) {
    return <div className="TextToImage"></div>;
  }

  return (
    <div className="TextToImage">
      <div
        className="TextToImage__container"
        onClick={() => {
          toggleImg();
          clicked.current = true;
        }}>
        <div
          className="TextToImage__scroller"
          style={{
            transform: `translate(${-100 * (Math.ceil(active / 2) % 2)}%,${
              -100 * Math.floor(active / 2)
            }%)`
          }}>
          {new Array(4).fill(0).map((_, i) => (
            <img
              key={i}
              src={`images/textToImage/${id}_${i}.png `}
              alt=""
              className={`TextToImage__img TextToImage__img--${i} ${
                i === active ? 'TextToImage__img--active' : ''
              }`}></img>
          ))}
        </div>
      </div>
    </div>
  );
}
