import React, { useState, useEffect } from 'react';

import { useEssay, useDisplayMode } from '@store';
import { animationDurations } from '@def';

import EaseIn from '../../_components/EaseAnimation/EaseIn';

import './EssayImage.css';

function EssayImage() {
  const [scanning, setScanning] = useState<boolean>(true);
  const { id } = useEssay(state => state.essay);
  const display = useDisplayMode(state => state.idx);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    setScanning(true);
    
    timeout = setTimeout(() => {
      setScanning(false);
    }, animationDurations.scan * 1000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [id]);

  console.log('Current id:', id, 'Scanning:', scanning);

  return id !== -1 ? (
    <div className={'EssayImage__locator ' + (display === 1 ? 'EssayImage__locator--large' : '')}>
      <div className="EssayImage__header">
        <div className="EssayImage__title">
          文本扫描
        </div>
        <img className="EssayImage__icon" src="/images/icons/right.svg" alt=""></img>
      </div>
      <div className="EssayImage__divider"></div> 
      <img className="EssayImage__left-top" src="/images/icons/left-top.svg" alt=""></img>
      <img className="EssayImage__right-bottom" src="/images/icons/right-bottom.svg" alt=""></img>
      <EaseIn key={id}>
        <div className="EssayImage__wrapper">
          <img className="EssayImage__img" src={`images/essays/${id}.jpg`} alt=""></img>
          {scanning && <div className="ScanLayer"></div>}
        </div>
      </EaseIn>
    </div>
  ) : null;
}

export default EssayImage;
