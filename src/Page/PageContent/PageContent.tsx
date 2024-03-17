import React from 'react';

import { useEssay, useDisplayMode } from '@store';
import Essay from './Essay/Essay';
import Analysis from './Analysis/Analysis';
import EssayDerivatives from './EssayDerivatives/EssayDerivatives';
import EssayMarks from './EssayMarks/EssayMarks';

import SideBar from './SideBar/SideBar';
import EssayImage from './EssayImage/EssayImage';

import './PageContent.css';

export default function PageContent() {
  const { id } = useEssay(state => state.essay);
  const displayMode = useDisplayMode(state => state.idx);

  return (
    <div className="PageContent__wrapper">
      <div className={`PageContent ${displayMode === 1 ? 'PageContent--large' : ''}`}>
        <SideBar></SideBar>
        <React.Fragment key={id}>
          <EssayDerivatives></EssayDerivatives>
          <Essay></Essay>
          {displayMode === 1 ? <EssayMarks></EssayMarks> : null}
          <Analysis></Analysis>
          <EssayImage></EssayImage>
        </React.Fragment>
      </div>
    </div>
  );
}
