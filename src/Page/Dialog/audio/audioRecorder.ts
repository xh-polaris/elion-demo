/*developing*/

import { useState, useRef, useEffect } from 'react';

import { getPostFunc, JsonProcessor, JsonPreProcessor } from 'src/request/post';
import type { Req, Res } from 'src/request/interfaces/speechToText';

const SLICE_MAX_DURATION = 3000;
const THRESHOLD = 40;

function audioRecord(maxDuration = SLICE_MAX_DURATION, threshold = THRESHOLD) {
  return new Promise(resolve => {
    let mediaRecorder: MediaRecorder | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let endFlag = false;

    let stopped = false;

    function startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          audioContext = new AudioContext();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;

          mediaRecorder = new MediaRecorder(stream);

          let audioChunks: Blob[] = [];
          mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            resolve({
              audio: audioBlob,
              endFlag
            });
            // const audioElement = new Audio(audioUrl);
            // document.body.appendChild(audioElement);
          };

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          mediaRecorder.start();

          // 在这里开始监测音频振幅
          setTimeout(() => {
            monitorAudioAmplitude();
          }, 2000);
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
    }

    function stopRecording() {
      stopped = true;
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    }

    function monitorAudioAmplitude() {
      if (!analyser) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function checkAmplitude() {
        if (stopped) {
          return;
        }
        analyser?.getByteFrequencyData(dataArray);
        const averageAmplitude = calculateAverageAmplitude(dataArray);

        // 当振幅低于阈值时停止录音
        if (averageAmplitude < threshold) {
          setTimeout(() => {
            stopRecording();
            endFlag = true;
          }, 1000);
        } else {
          // 继续检测振幅
          requestAnimationFrame(checkAmplitude);
        }
      }

      // 开始检测振幅
      checkAmplitude();
    }

    function calculateAverageAmplitude(dataArray: Uint8Array): number {
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      console.log(sum / dataArray.length);
      return sum / dataArray.length;
    }

    startRecording();
    setTimeout(() => {
      stopRecording();
    }, maxDuration);
  }) as Promise<{
    audio: Blob;
    endFlag: boolean;
  }>;
}

const post = getPostFunc<Req, Res>(
  'speechToText',
  data => {
    const formData = new FormData();
    formData.append('audio', data);
    return {
      body: formData
    };
  },
  JsonProcessor
);

async function audioTranscribe(audioBlob: Blob) {
  const { text } = await post(audioBlob);
  return text;
}

const CHAT_MAX_DURATION = 60000;

export function useChatTranscribe() {
  const [texts, setTexts] = useState<string[]>([]);
  const [state, setState] = useState(0);
  const transcribedFlags = useRef<boolean[]>([]);
  const chatIdx = useRef(0);

  function getAvaliableCnt() {
    let availableCnt = 0;
    for (let i = 0; i < transcribedFlags.current.length; i++) {
      if (transcribedFlags.current[i]) {
        availableCnt++;
      } else {
        break;
      }
    }
    return availableCnt;
  }

  function getAudioSlice(index: number, chatIndex: number) {
    console.log('start', chatIndex, index);
    return audioRecord()
      .then(({ audio, endFlag }) => {
        if (chatIdx.current !== chatIndex || state === 2) {
          return true;
        }
        audioTranscribe(audio).then(text => {
          if (chatIdx.current !== chatIndex) {
            return;
          }
          texts[index] = text;
          setTexts([...texts]);
          transcribedFlags.current[index] = true;
        });
        console.log(endFlag, chatIdx, index);
        return endFlag;
      })
      .then(endFlag => {
        if (chatIdx.current !== chatIndex) {
          return;
        }
        if (!endFlag) {
          getAudioSlice(index + 1, chatIndex);
        }
        if (endFlag) {
          stopChat();
        }
      });
  }

  function startChat() {
    setState(1);
    setTexts([]);
    transcribedFlags.current = [];
    getAudioSlice(0, ++chatIdx.current);
  }

  function stopChat() {
    setState(2);
  }

  useEffect(() => {
    if (state === 1) {
      const timeout = setTimeout(() => {
        stopChat();
      }, CHAT_MAX_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const availableTexts = texts.slice(0, getAvaliableCnt());

  console.log(texts);

  return { startChat, stopChat, availableTexts, state };
}
