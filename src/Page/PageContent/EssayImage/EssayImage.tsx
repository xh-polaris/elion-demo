import React, { useEffect, useState } from 'react';

import { useEssay } from '@store';
import { animationDurations } from '@def';

import EaseIn from '../../_components/EaseAnimation/EaseIn';
import EaseOut from '../../_components/EaseAnimation/EaseOut';

import './EssayImage.css';

function EssayImage() {
  const [hide, setHide] = useState<boolean>(false);
  const [easeOut, setEaseOut] = useState<boolean>(false);
  const { id } = useEssay(state => state.essay);

  useEffect(() => {
    const timeout0 = setTimeout(() => {
      setHide(true);
    }, (animationDurations.scan + 0.3) * 1000);
    const timeout1 = setTimeout(() => {
      setEaseOut(true);
    }, animationDurations.scan * 1000);

    return () => {
      clearTimeout(timeout0);
      clearTimeout(timeout1);
    };
  }, []);

  return id !== -1 && !hide ? (
    <div className="EssayImage__locator">
      <EaseIn>
        <EaseOut trigger={easeOut}>
          <div className="EssayImage__wrapper">
            <img className="EssayImage__img" src={`images/essays/${id}.jpg`} alt=""></img>
            <div className="ScanLayer"></div>
          </div>
        </EaseOut>
      </EaseIn>
    </div>
  ) : null;
}

export default EssayImage;
