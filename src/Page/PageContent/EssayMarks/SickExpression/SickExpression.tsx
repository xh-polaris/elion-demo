import React, { useMemo } from 'react';
import { Popover } from 'antd';

import { useEssay } from '@store';

import TypewriterAnimation from 'src/Page/_components/TypewriterAnimation/TypewriterAnimation';

import './SickExpression.css';
import { useScrollToMark } from 'src/hooks/useScrollToMark';

export default function SickExpression() {
  const { sick_sents_arranged, textCorrections_arranged, sents } = useEssay(store => store.essay);
  const selectedSentence = useEssay(store => store.selectedSentence);
  const setSelectedSentence = useEssay(store => store.setSelectedSentence);

  const sickSentsList = useMemo(() => {
    return sick_sents_arranged.map((sickSentsInParagraph, paragraphId) => (
      <div className="SickExpression__sickSents__wrapper" key={paragraphId}>
        {sickSentsInParagraph.map((sickSent, sentId) => {
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
              className="SickExpression__sickSent"
              data-paragraph-id={paragraphId}
              data-sent-id={sentId}
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
  }, [sick_sents_arranged, textCorrections_arranged, sents, setSelectedSentence]);

  // 使用 useEffect 来更新选中状态的样式
  React.useEffect(() => {
    document.querySelectorAll('.SickExpression__sickSent').forEach(el => {
      const paragraphId = Number(el.getAttribute('data-paragraph-id'));
      const sentId = Number(el.getAttribute('data-sent-id'));
      
      if (selectedSentence?.paragraphId === paragraphId && 
          selectedSentence?.sentId === sentId) {
        el.classList.add('SickExpression__sickSent--selected');
      } else {
        el.classList.remove('SickExpression__sickSent--selected');
      }
    });
  }, [selectedSentence]);

  // 添加滚动功能
  useScrollToMark(selectedSentence, '.SickExpression__sickSent', '.SickExpression');

  return (
    <div className="SickExpression">
      <TypewriterAnimation duration={1} list={sickSentsList} key="sickSents" />
    </div>
  );
}
