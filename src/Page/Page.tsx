import React from 'react';

import { useEssay } from '@store';

import Autofit from './_components/Autofit/Autofit';

import SideBar from './SideBar/SideBar';
import PageContent from './PageContent/PageContent';
import EssayImage from './EssayImage/EssayImage';
import Dialog from './Dialog/Dialog';

import BgVideo from './BgVideo/BgVideo';
import PageTitle from './PageTitle/PageTitle';

import './Page.css';

function Page() {
  const { id } = useEssay(state => state.essay);

  return (
    <Autofit>
      <div className="Page">
        <BgVideo></BgVideo>
        <PageTitle></PageTitle>
        <SideBar></SideBar>
        <div className="Page__content">
          <PageContent key={id} />
        </div>
        <EssayImage key={id}></EssayImage>
        <Dialog></Dialog>
      </div>
    </Autofit>
  );
}

export default Page;
