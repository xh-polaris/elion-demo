import { useEffect } from 'react';

import { useSpeechResp } from 'src/request/textToSpeech';

export const WELCOME_TEXT =
  '您好，我是作文助教小花狮，您可以向我提问和这篇文章有关的问题，我会为您总结和点评。';

export default function WelcomeSpeech() {
  const { res, get, loading } = useSpeechResp();

  useEffect(() => {
    if (!loading) {
      get('welcome', WELCOME_TEXT);
    }
  }, []);

  return res ? <audio src={res.url} autoPlay></audio> : null;
}
