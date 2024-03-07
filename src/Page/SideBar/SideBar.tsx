import React, { useState } from 'react';

import { ESSAYS, useEssay } from '@store';

import './SideBar.css';

const ESSAY_COUNT = ESSAYS.length;
const ESSAY_PER_PAGE = 8;
const MAX_PAGE = Math.floor(ESSAY_COUNT / ESSAY_PER_PAGE);

function SideBar() {
  const loadEssay = useEssay(state => state.loadEssay);
  const essayIdx = useEssay(state => state.essayIdx);

  const [page, setPage] = useState<number>(0);

  function changePage(diff: number) {
    const target = page + diff;
    if (target >= 0 && target <= MAX_PAGE) {
      setPage(target);
    }
  }

  return (
    <div className="SideBar">
      <img
        src="images/icons/arrow-down-s-line.svg"
        className={`Arrow Arrow__up ${page === 0 ? 'Arrow__hide' : ''}`}
        alt=""
        onClick={() => changePage(-1)}></img>
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
      <img
        src="images/icons/arrow-down-s-line.svg"
        className={`Arrow ${page >= MAX_PAGE ? 'Arrow__hide' : ''}`}
        alt=""
        onClick={() => changePage(1)}></img>
    </div>
  );
}

export default SideBar;
