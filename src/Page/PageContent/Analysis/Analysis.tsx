import React from 'react'

import { useEssay } from '@store'
import { dimensionDescs } from '@def'

import Title from '../../_components/Title/Title'
import OpacityBg from '../../_components/OpacityBg/OpacityBg'
import Battery from '../../_components/Battery/Battery'

import RadarChart from './RadarChart/RadarChart'
import Comment from './Comment/Comment'

import './Analysis.css'

const CommentTitles = ['综合点评', ...dimensionDescs]

function Analysis() {
  const { comments, scores, id } = useEssay(state => state.essay)
  const changeIdx = useEssay(state => state.changeViewIdx)
  const viewIdx = useEssay(state => state.viewIdx)

  const comment = comments[viewIdx]

  return (
    <div className="Analysis">
      <OpacityBg>
        <Title zh="综合能力" en="COMPREHENSIVE ABILITY"></Title>
        <div className="divider"></div>
        <div className="RadarChartBoard">
          <RadarChart></RadarChart>
        </div>
      </OpacityBg>
      <div className="Analysis__spacing"></div>
      <Title zh={CommentTitles[viewIdx]}></Title>
      <div className="CommentBoard">
        <div className="divider2"></div>
        <Comment content={comment} key={id + ' ' + viewIdx}></Comment>
      </div>

      <div className="Battery--overall" onClick={() => changeIdx(0)}>
        <Battery score={scores[0]} active={viewIdx === 0}></Battery>
      </div>
    </div>
  )
}

export default Analysis
