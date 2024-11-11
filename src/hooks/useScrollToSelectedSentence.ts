import { useEffect } from 'react';
import { useEssay } from '@store';

export const useScrollToSelectedSentence = (scrollerRef: React.RefObject<HTMLElement>) => {
  const selectedSentence = useEssay(store => store.selectedSentence);

  useEffect(() => {
    if (!selectedSentence || !scrollerRef.current) return;
    
    const selectedElement = document.querySelector(
      `.Essay__text[data-paragraph="${selectedSentence.paragraphId}"][data-sentence="${selectedSentence.sentId}"]`
    );

    if (selectedElement) {
      const elementTop = (selectedElement as HTMLElement).offsetTop;
      const scrollerHeight = scrollerRef.current.clientHeight;
      const targetScroll = elementTop - scrollerHeight / 2;

      scrollerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [selectedSentence]);
}; 