import React from 'react';

import Autofit from './_components/Autofit/Autofit';

import PageContent from './PageContent/PageContent';

import Dialog from './Dialog/Dialog';

import PageTitle from './PageTitle/PageTitle';
import Controls from './Controls/Controls';

import Background from './Background/Background';

import './Page.css';

function Page() {
  return (
    <div style={{ position: 'relative' }}>
      <div className="CenterLocator">
        <Autofit mode={1}>
          {/*<BgVideo></BgVideo>*/}
          
        </Autofit>
      </div>
      <div className="CenterLocator">
        <Autofit>
          <div className="Page">
            <Background />
            <PageTitle></PageTitle>
            <Controls></Controls>
            <PageContent />
            <Dialog></Dialog>
          </div>
        </Autofit>
      </div>
    </div>
  );
}

export default Page;
