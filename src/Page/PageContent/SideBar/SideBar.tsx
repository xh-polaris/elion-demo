import React, { useState } from 'react';

import { ESSAYS, useEssay } from '@store';

import './SideBar.css';


function SideBar() {
  const loadEssay = useEssay(state => state.loadEssay);
  const essayIdx = useEssay(state => state.essayIdx);

  const [page] = useState<number>(0);


  return (
    <div className="SideBar">
      <div className="EssayList">
        <div className="EssayList--content" style={{ transform: `translateY(${-637 * page}px)` }}>
          {ESSAYS.map(({ id }, i) =>
            i ? (
              <div
                className={'EssayThumbnail ' + (essayIdx === i ? 'EssayThumbnail--active' : '')}
                key={i}
                onClick={() => loadEssay(i)}>
                <img className="EssayThumbnail__img" src={`images/essays/${id}.jpg`} alt=""></img>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
