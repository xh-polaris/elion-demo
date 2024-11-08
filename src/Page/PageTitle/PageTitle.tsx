import React from 'react';

import { useDialog, useEssay } from '@store';

import './PageTitle.css';

export default function PageTitle() {
  const callDialog = useDialog(state => state.toggleActive);
  const { id } = useEssay(state => state.essay);

  return (
    <div className="PageTitle" onClick={() => id !== -1 && callDialog(true)}>
      <img className="PageTitle__logo" src="images/logo/logo.png" alt=""></img>
      <div className="PageTitle__title">小花狮作文智能辅导系统</div>
      {/* <div className="PageTitle__subtitle">小花狮</div> */}
    </div>
  );
}
