import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';

import { animationDurations } from '@def';

import './Battery.css';

const ANIMATION_DURATION = animationDurations.battery;

export default function Battery({ score, active }: { score: number; active: boolean }) {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    setPercent(score / 100);
  }, [score]);

  return (
    <div className={`Battery ${active ? 'Battery--active' : ''}`}>
      <div className="Battery__units" style={{ clip: `rect(0px, ${68 * percent}px, 26px, 0px)` }}>
        <div className="Battery__unit"></div>
        <div className="Battery__unit"></div>
        <div className="Battery__unit"></div>
        <div className="Battery__unit"></div>
      </div>

      <div className="Battery__score">
        <CountUp start={0} end={score} duration={ANIMATION_DURATION} useEasing={false}></CountUp>
      </div>
      <div className="Battery__deco"></div>
    </div>
  );
}
