import React, { useEffect, useRef, useState } from 'react';

function TypewriterAnimation({
  list,
  duration,
  watcher
}: {
  list: (JSX.Element|string)[];
  duration: number;
  watcher?: any;
}) {
  const [currentList, setCurrentList] = useState<(JSX.Element|string)[]>([]);
  const cnt = useRef<number>(0);
  const watch = useRef<any>(undefined);

  useEffect(() => {
    cnt.current = 0;

    if (list.length !== undefined) {
      if ((watcher !== undefined && watch.current === watcher) || list.length === 0) {
        setCurrentList(list);
      } else {
        const interval = (1000 * duration) / list.length;
        let intervalId = setInterval(() => {
          if (cnt.current < list.length) {
            cnt.current++;
            setCurrentList(list.slice(0, cnt.current));
          } else {
            watch.current = watcher;
            clearInterval(intervalId);
          }
        }, interval);
        return () => clearInterval(intervalId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return <>{currentList}</>;
}

export default TypewriterAnimation;
