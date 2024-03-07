import React from 'react';

import Essay from './Essay/Essay';
import Analysis from './Analysis/Analysis';
import EssayDerivative from './EssayDerivative/EssayDerivative';

import './PageContent.css';

export default function PageContent() {
  return (
    <div className="PageContent">
      <EssayDerivative></EssayDerivative>
      <Essay></Essay>
      <Analysis></Analysis>
    </div>
  );
}
