import React from 'react';
import { Popover } from 'antd';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';

import './SickExpression.css';

export default function SickExpression() {
  const { sick_sents_arranged, textCorrections_arranged, sents } = useEssay(store => store.essay);

  const sickSents = sick_sents_arranged.map((sickSentsInParagraph, paragraphId) => (
    <div className="SickExpression__sickSents__wrapper" key={paragraphId}>
      {sickSentsInParagraph.map((sickSent, sentId) => {
        let textCorrections = textCorrections_arranged[paragraphId]
          ? textCorrections_arranged[paragraphId][sentId]
          : null;

        const chars = sents[paragraphId][sentId].split('');

        const list = chars.map((char, i) => {
          if (textCorrections) {
            const tokenTarget = textCorrections.token_idx.indexOf(i);
            if (tokenTarget > -1) {
              let revisedTokenIdx = textCorrections.revised_token_idx[tokenTarget];
              let label = textCorrections.label[tokenTarget];
              let revisedToken = textCorrections.revised_sent[revisedTokenIdx];

              let popoverContent =
                label === 'R'
                  ? `"${char}"替换为"${revisedToken}"`
                  : label === 'D'
                  ? `删除"${char}"`
                  : `增加"${revisedToken}"`;

              return (
                <Popover title={<div>{popoverContent}</div>} key={i}>
                  <span className="SickExpression__revised">{char}</span>
                </Popover>
              );
            }
          }

          return <span key={i}>{char}</span>;
        });

        return (
          <div className="SickExpression__sickSent" key={sentId}>
            <TypewriterAnimation duration={1} list={list}></TypewriterAnimation>
            <div className="SickExpression__label">{sickSent.label}</div>
          </div>
        );
      })}
    </div>
  ));

  return (
    <div className="SickExpression">
      {sickSents.length ? (
        <div className="SickExpression__Title SickExpression__Title--sickWord">病句</div>
      ) : null} 
      <TypewriterAnimation duration={1} list={sickSents}></TypewriterAnimation>
    </div>
  );
}
