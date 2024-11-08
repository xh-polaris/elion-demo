import React from 'react';

import Title from '../../_components/Title/Title';
import OpacityBg from '../../_components/OpacityBg/OpacityBg';

import TextToImage from './TextToImage/TextToImage';
import TextToVideo from './TextToVideo/TextToVideo';

import './EssayDerivatives.css';

export default function EssayDerivatives() {
  return (
    <div className="EssayDerivative">
      <OpacityBg>
        <Title zh="作文配图" en="TEXT TO IMAGE"></Title>
        <div className="EssayDerivative__divider"></div>
        <TextToImage />
      </OpacityBg>
      <div className="EssayDerivative__spacing"></div>
      <OpacityBg>
        <Title zh="作文视频" en="TEXT TO VIDEO"></Title>
        <div className="EssayDerivative__divider"></div>
        <TextToVideo />
      </OpacityBg>
    </div>
  );
}
