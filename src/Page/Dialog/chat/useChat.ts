import { useState, useMemo, useRef, Suspense } from 'react';
import { getPostFunc, JsonPreProcessor } from 'src/request/post';
import { useEssay } from '@store';

const textDecoder = new TextDecoder('utf-8');

export function useChatResp() {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState<string>('');
  const [chatIdx, setChatIdx] = useState<number>(-1);
  const chucks = useRef<string>('');

  const postFunc = useMemo(
    () =>
      getPostFunc('chat', JsonPreProcessor, async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const str = textDecoder.decode(value);

          console.log('Received chunk:', textDecoder.decode(value));
          chucks.current += str;
          setText(chucks.current);
        }
        return;
      }),
    []
  );

  const { title, content } = useEssay(state => state.essay);

  function getChatResp(input: string) {
    if (!replying) {
      setChatIdx(idx => idx + 1);
      chucks.current = '';
      setText(chucks.current);
      setReplying(true);
      return postFunc({
        essay: {
          title,
          content
        },
        input
      }).then(() => {
        setReplying(false);
      });
    }
  }

  return { res: text, get: getChatResp, replying, chatIdx };
}
