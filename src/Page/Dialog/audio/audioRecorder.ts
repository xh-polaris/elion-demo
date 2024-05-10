/*developing*/

import { useState, useRef, useEffect } from 'react';

import { getPostFunc, JsonProcessor, JsonPreProcessor } from 'src/request/post';
import type { Req, Res } from 'src/request/interfaces/speechToText';

import { RecognitionState } from './audioRecognizer';

const SLICE_MAX_DURATION = 5000;
// const THRESHOLD = 20;

// export function audioRecord(maxDuration = SLICE_MAX_DURATION, threshold = THRESHOLD) {
//   return new Promise(resolve => {
//     let mediaRecorder: MediaRecorder | null = null;
//     let audioContext: AudioContext | null = null;
//     let analyser: AnalyserNode | null = null;
//     let endFlag = false;

//     let stopped = false;

//     function startRecord() {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then(stream => {
//           audioContext = new AudioContext();
//           analyser = audioContext.createAnalyser();
//           analyser.fftSize = 256;

//           mediaRecorder = new MediaRecorder(stream);

//           let audioChunks: Blob[] = [];
//           mediaRecorder.ondataavailable = event => {
//             if (event.data.size > 0) {
//               audioChunks.push(event.data);
//             }
//           };

//           mediaRecorder.onstop = () => {
//             const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//             resolve({
//               audio: audioBlob,
//               endFlag
//             });
//             // const audioElement = new Audio(audioUrl);
//             // document.body.appendChild(audioElement);
//           };

//           const source = audioContext.createMediaStreamSource(stream);
//           source.connect(analyser);

//           mediaRecorder.start();

//           // 在这里开始监测音频振幅
//           setTimeout(() => {
//             monitorAudioAmplitude();
//           }, 2000);
//         })
//         .catch(err => {
//           console.error('Error accessing microphone:', err);
//         });
//     }

//     function stopRecord() {
//       stopped = true;
//       if (mediaRecorder && mediaRecorder.state === 'recording') {
//         mediaRecorder.stop();
//       }
//       if (audioContext && audioContext.state !== 'closed') {
//         audioContext.close();
//       }
//     }

//     function calculateAverageAmplitude(dataArray: Uint8Array): number {
//       let sum = 0;
//       for (let i = 0; i < dataArray.length; i++) {
//         sum += dataArray[i];
//       }

//       return sum / dataArray.length;
//     }

//     function monitorAudioAmplitude() {
//       if (!analyser) return;

//       const dataArray = new Uint8Array(analyser.frequencyBinCount);

//       function checkAmplitude() {
//         console.log('checking');
//         if (stopped) {
//           return;
//         }
//         analyser?.getByteFrequencyData(dataArray);
//         const averageAmplitude = calculateAverageAmplitude(dataArray);
//         console.log(averageAmplitude);

//         // 当振幅低于阈值时停止录音
//         if (averageAmplitude < threshold) {
//           setTimeout(() => {
//             stopRecord();
//             endFlag = true;
//           }, 1000);
//         } else {
//           // 继续检测振幅
//           requestAnimationFrame(checkAmplitude);
//         }
//       }

//       // 开始检测振幅
//       checkAmplitude();
//     }

//     startRecord();
//     setTimeout(() => {
//       stopRecord();
//     }, maxDuration);
//   }) as Promise<{
//     audio: Blob;
//     endFlag: boolean;
//   }>;
// }

function audioRecord(maxDuration = SLICE_MAX_DURATION) {
  return new Promise(resolve => {
    let mediaRecorder: MediaRecorder | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    function startRecord() {
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
              audio: audioBlob
            });
            // const audioElement = new Audio(audioUrl);
            // document.body.appendChild(audioElement);
          };

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          mediaRecorder.start();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
    }

    function stopRecord() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    }
    startRecord();
    setTimeout(() => {
      stopRecord();
    }, maxDuration);
  }) as Promise<{
    audio: Blob;
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

export async function audioTranscribe() {
  const { audio } = await audioRecord();
  const { text } = await post(audio);
  return text;
}

const CHAT_MAX_DURATION = 30000;

class AudioRecognition {
  private transcripts: string[] = [];
  private stopFlag: boolean = false;
  private timeout: number | undefined;
  public onend: (() => void) | null = null;
  public onresult: ((transcripts: string[]) => void) | null = null;

  start() {
    let that = this;
    async function continuousTranscribe(idx: number = 0) {
      if (that.stopFlag) {
        return;
      }
      const { audio } = await audioRecord();
      if (that.stopFlag) {
        return;
      }
      post(audio).then(({ text }) => {
        if (that.stopFlag) {
          return;
        }
        that.transcripts[idx] = text;
        if (that.onresult) {
          that.onresult(that.transcripts);
        }
      });
      continuousTranscribe(idx + 1);
    }
    continuousTranscribe();
    that.timeout = setTimeout(() => {
      this.stop();
    }, CHAT_MAX_DURATION) as unknown as number;
  }
  stop() {
    if (!this.stopFlag) {
      this.stopFlag = true;
      if (this.onend) {
        this.onend();
      }
      clearTimeout(this.timeout);
    }
  }
}

export function useTranscribe() {
  const [state, setState] = useState<RecognitionState>(RecognitionState.initial);
  const [result, setResult] = useState<string>('');
  const reco = useRef<AudioRecognition>();

  function startReco() {
    setState(RecognitionState.speechstart);
    setResult('');

    const recognition = new AudioRecognition();
    reco.current = recognition;

    recognition.start();

    recognition.onresult = (transcripts: string[]) => {
      setResult(transcripts.join(''));
      // recognition.onresult = null;
    };

    recognition.onend = () => {
      recognition.onresult = null;
      setState(RecognitionState.end);
    };
  }

  function stopReco() {
    reco.current?.stop();
  }

  function controlReco() {
    if (state === RecognitionState.speechstart) {
      stopReco();
    } else {
      startReco();
    }
  }

  return { controlReco, startReco, stopReco, result, state };
}
