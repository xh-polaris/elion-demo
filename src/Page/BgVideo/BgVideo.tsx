
import { useBgVideo } from '@store';

import './BgVideo.css';

export default function BgVideo() {
  const videoName = useBgVideo(video => video.videoName);

  return (
    <div className="BgVideo__wrapper">
      <video
        className="BgVideo"
        controls={false}
        src={`videos/bg/${videoName}.mp4`}
        muted
        autoPlay
        loop></video>
    </div>
  );
}
