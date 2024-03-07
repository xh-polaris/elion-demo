import { usePost, getPostFunc, JsonPreProcessor } from './post';
import type { Req } from './interfaces/textToSpeech';

function getSpeechDuration(audio: HTMLAudioElement) {
  return new Promise(res => {
    audio.addEventListener('loadeddata', () => [res(audio.duration)]);
  }) as Promise<number>;
}

function parseSpeechUrl(response: Response) {
  return response.blob().then(blob => {
    return URL.createObjectURL(blob);
  });
}

async function speechProcessor(response: Response) {
  const url = await parseSpeechUrl(response);
  const audio = new Audio(url);
  const duration = await getSpeechDuration(audio);
  return { audio, url, duration };
}

export type Speech = Awaited<ReturnType<typeof speechProcessor>>;

export const GLOBAL_VOICE = {
  voice: 4
};
export const VOICE_CNT = 6;

export function useSpeechResp() {
  const { result, loading, launch } = usePost<Req, Speech>(
    'textToSpeech',
    JsonPreProcessor,
    speechProcessor
  );

  function getSpeechResp(id: string | undefined, text: string) {
    return launch({
      id,
      text,
      voiceId: GLOBAL_VOICE.voice
    });
  }

  return { res: result, get: getSpeechResp, loading };
}

export function getSpeechResp(text: string) {
  const post = getPostFunc<Req, Speech>('textToSpeech', JsonPreProcessor, speechProcessor);
  return post({
    id: undefined,
    text,
    voiceId: GLOBAL_VOICE.voice
  });
}
