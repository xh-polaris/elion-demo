import React, { useMemo } from 'react';

import { useEssay } from '@store';

import {
  Pentagon,
  PentagonInsideLines,
  PentagonVertexs,
  PentagonVertexScores,
  MAX_CENTER_TO_VERTEX
} from './Pentagon/Pentagon';

import './RadarChart.css';

const MAX_SCORE = 100;
const MIN_SCORE = 60;

function RadarChart() {
  const scores = useEssay(state => state.essay.scores).slice(1, 6);
  const scoreDimensions = scores.map(
    score => ((score * score) / (MAX_SCORE * MAX_SCORE)) * MAX_CENTER_TO_VERTEX
  );
  const idx = useEssay(state => state.viewIdx);

  const rotates = (function () {
    // return [0, 0];
    switch (idx) {
      case 1:
        return [-12, 0];
      case 2:
        return [-6, -10];
      case 3:
        return [-2, -16];
      case 4:
        return [2, 16];
      case 5:
        return [6, 10];
      default:
        return [0, 0];
    }
  })();

  const PentagonBackground = useMemo(
    () => (
      <>
        <Pentagon
          dimensions={new Array(5).fill(120)}
          shadowDirection="out"
          shadowDeviation="8"></Pentagon>
        <Pentagon
          dimensions={new Array(5).fill(96)}
          style={{ fill: 'rgb(82,139,206)' }}
          shadowDirection="out"></Pentagon>
        <Pentagon dimensions={new Array(5).fill(72)} shadowDirection="in"></Pentagon>
        <Pentagon
          dimensions={new Array(5).fill(48)}
          style={{ fill: 'rgb(82,139,206)' }}
          shadowDirection="out"></Pentagon>
        <Pentagon dimensions={new Array(5).fill(24)} shadowDirection="in"></Pentagon>
        <PentagonInsideLines></PentagonInsideLines>
      </>
    ),
    []
  );

  return (
    <div className="RadarChartBoard__background">
      <div
        className="RadarChart__wrapper"
        style={
          idx
            ? { transform: `rotateX(${rotates[0]}deg) rotateY(${rotates[1]}deg) translateZ(50px)` }
            : {}
        }>
        {PentagonBackground}
        <Pentagon
          animated
          dimensions={scoreDimensions}
          style={{
            stroke: 'rgb(251,251,251)',
            strokeWidth: '3',
            fill: 'rgb(233, 249, 49 ,0.35)'
          }}
          shadowDirection="in"></Pentagon>
        <PentagonVertexs dimensions={scoreDimensions}></PentagonVertexs>
        <PentagonVertexScores scores={scores}></PentagonVertexScores>
      </div>
    </div>
  );
}

export default RadarChart;
