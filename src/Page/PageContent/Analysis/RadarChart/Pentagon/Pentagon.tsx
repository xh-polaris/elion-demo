import React from 'react';

import { useEssay } from '@store';
import { animationDurations, dimensionDescs } from '@def';

import Battery from 'src/Page/_components/Battery/Battery';

import './Pentagon.css';

export const MAX_CENTER_TO_VERTEX = 120;

const MAX = MAX_CENTER_TO_VERTEX + 60;

const SIN72 = Math.sin((Math.PI * 2) / 5);
const COS72 = Math.cos((Math.PI * 2) / 5);
const SIN54 = Math.sin((Math.PI * 3) / 10);
const COS54 = Math.cos((Math.PI * 3) / 10);

const WIDTH = 2 * MAX * SIN72;
const HEIGHT = MAX * SIN54 + MAX;

const centerPoint = [MAX * SIN72, MAX];

const ANIMATION_DURATION = animationDurations.pentagon;

function getVertexs(dimensions: number[]) {
  const points = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ] as number[][];

  points[0][0] = MAX * SIN72;
  points[0][1] = MAX - dimensions[0];

  points[1][0] = MAX * SIN72 + dimensions[1] * SIN72;
  points[1][1] = MAX - dimensions[1] * COS72;

  points[2][0] = MAX * SIN72 + dimensions[2] * COS54;
  points[2][1] = MAX + dimensions[2] * SIN54;

  points[3][0] = MAX * SIN72 - dimensions[3] * COS54;
  points[3][1] = MAX + dimensions[3] * SIN54;

  points[4][0] = MAX * SIN72 - dimensions[4] * SIN72;
  points[4][1] = MAX - dimensions[4] * COS72;

  return points;
}

export function Pentagon({
  dimensions,
  style = {},
  shadowDirection,
  shadowDeviation,
  animated
}: {
  dimensions: number[];
  style?: React.SVGAttributes<SVGPolygonElement>['style'];
  divStyle?: React.HTMLAttributes<HTMLDivElement>['style'];
  shadowDirection?: 'out' | 'in';
  shadowDeviation?: string;
  animated?: boolean;
}) {
  const vertexs = getVertexs(dimensions);

  const getPointsStr = (points: number[][]) => points.map(xy => xy.join(',')).join(' ');

  return (
    <div style={{ position: 'absolute' }}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={WIDTH} height={HEIGHT}>
        <defs>
          {/* <filter id="blur-out">
            <feOffset result="offOut" in="SourceAlpha" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0.9 0 0 0 0 0 0.9 0 0 0 0 0 0.9 0 0 0 0 0 1 0"
            />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter> */}
          <filter id={'blur-out' + shadowDeviation}>
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation={shadowDeviation ?? '6'}
              floodColor="rgb(219,227,255)"
            />
          </filter>
          <filter id={'blur-in' + shadowDeviation}>
            <feFlood floodColor="rgb(250,250,250)" />
            <feComposite operator="out" in2="SourceGraphic" />
            <feGaussianBlur stdDeviation={shadowDeviation ?? '6'} />
            <feComposite operator="atop" in2="SourceGraphic" />
          </filter>
        </defs>
        <polygon
          filter={
            shadowDirection ? `url(#blur-${shadowDirection}${shadowDeviation})` : shadowDirection
          }
          points={getPointsStr(vertexs)}
          style={{
            fill: 'rgb(116,174,228)',
            stroke: 'rgb(219,227,255)',
            strokeWidth: 1,
            ...style
          }}>
          {animated ? (
            <animate
              attributeName="points"
              from={getPointsStr(new Array(5).fill(centerPoint))}
              to={getPointsStr(vertexs)}
              dur={ANIMATION_DURATION}
            />
          ) : null}
        </polygon>
      </svg>
    </div>
  );
}

export function PentagonInsideLines() {
  const points = getVertexs(new Array(5).fill(MAX_CENTER_TO_VERTEX));

  return (
    <div style={{ position: 'absolute' }}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={WIDTH} height={HEIGHT}>
        {points.map(([x, y], i) => (
          <line
            x1={x}
            y1={y}
            x2={centerPoint[0]}
            y2={centerPoint[1]}
            style={{ stroke: 'rgb(200,200,200)', strokeWidth: 1 }}
            key={i}
          />
        ))}
      </svg>
    </div>
  );
}

export function PentagonVertexs({ dimensions }: { dimensions: number[] }) {
  const points = getVertexs(dimensions);

  return (
    <div style={{ position: 'absolute' }}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={WIDTH} height={HEIGHT}>
        {points.map(([x, y], i) => (
          <circle cx={x} cy={y} r="4" fill="rgb(251,251,251)" key={`${x} ${y} ${i}`}>
            <animate attributeName="cx" from={centerPoint[0]} to={x} dur={ANIMATION_DURATION} />
            <animate attributeName="cy" from={centerPoint[1]} to={y} dur={ANIMATION_DURATION} />
          </circle>
        ))}
      </svg>
    </div>
  );
}

export function PentagonVertexScores({ scores }: { scores: number[] }) {
  const changeIdx = useEssay(state => state.changeViewIdx);
  const idx = useEssay(state => state.viewIdx);

  const vertexArray = new Array(5).fill(MAX_CENTER_TO_VERTEX + 40);
  if (idx > 0) {
    vertexArray[idx - 1] = MAX_CENTER_TO_VERTEX + 55;
  }

  const points = getVertexs(vertexArray);

  return (
    <div style={{ position: 'absolute', width: WIDTH, height: HEIGHT }}>
      {points.map(([x, y], i) => (
        <div
          className="PentagonVertexScore"
          key={i}
          style={{ left: x, top: y }}
          onClick={() => changeIdx(i + 1)}>
          <div className="PentagonVertexScore__desc">{dimensionDescs[i]}</div>
          <div className="PentagonVertexScore__score">
            <Battery key={`${x} ${y} ${i}`} score={scores[i]} active={idx - 1 === i}></Battery>
          </div>
        </div>
      ))}
    </div>
  );
}
