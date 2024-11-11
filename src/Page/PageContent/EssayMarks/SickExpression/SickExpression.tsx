import React, { useMemo } from 'react';
import { Popover } from 'antd';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';

import './SickExpression.css';

export default function SickExpression() {
  const { sick_sents_arranged, textCorrections_arranged, sents } = useEssay(store => store.essay);
  const selectedSentence = useEssay(store => store.selectedSentence);
  const setSelectedSentence = useEssay(store => store.setSelectedSentence);

  const sickSents = useMemo(() => {
    return sick_sents_arranged.map((sickSentsInParagraph, paragraphId) => (
      <div className="SickExpression__sickSents__wrapper" key={paragraphId}>
        {sickSentsInParagraph.map((sickSent, sentId) => {
          const isSelected = selectedSentence?.paragraphId === paragraphId && 
                            selectedSentence?.sentId === sentId;
          
          let textCorrections = textCorrections_arranged[paragraphId]?.[sentId];
          const chars = sents[paragraphId][sentId].split('');

          const list = chars.map((char, i) => {
            if (textCorrections) {
              const tokenTarget = textCorrections.token_idx.indexOf(i);
              if (tokenTarget > -1) {
                // let revisedTokenIdx = textCorrections.revised_token_idx[tokenTarget];
                let label = textCorrections.label[tokenTarget];
                let revisedToken = textCorrections.corrections[tokenTarget];

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
            <div 
              className={`SickExpression__sickSent ${isSelected ? 'SickExpression__sickSent--selected' : ''}`}
              onClick={() => setSelectedSentence(paragraphId, sentId)}
              key={sentId}
            >
              <div className="SickExpression__sickSent__header">病句</div>
              <div className="SickExpression__sickSent__content">
                {list}
              </div>
              <div className="SickExpression__label">{sickSent.label}</div>
            </div>
          );
        })}
      </div>
    ));
  }, [sick_sents_arranged, selectedSentence, sents, textCorrections_arranged]);

  return (
    <div className="SickExpression">
      <TypewriterAnimation duration={1} list={sickSents} key="sickSents" />
    </div>
  );
}
