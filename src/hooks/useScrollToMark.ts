import { useEffect } from 'react';

export function useScrollToMark(
  selectedSentence: { paragraphId: number; sentId: number } | null,
  selector: string,
  containerSelector: string
) {
  useEffect(() => {
    if (!selectedSentence) return;
    
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    elements.forEach(el => {
      const element = el as HTMLElement;  // 添加类型断言
      const paragraphId = Number(element.getAttribute('data-paragraph-id'));
      const sentId = Number(element.getAttribute('data-sent-id'));
      
      if (selectedSentence.paragraphId === paragraphId && 
          selectedSentence.sentId === sentId) {
        // 计算元素相对于容器的位置
        const elementTop = element.offsetTop;
        const containerHeight = container.clientHeight;
        const scrollTop = elementTop - containerHeight / 2 + element.offsetHeight / 2;
        
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    });
  }, [selectedSentence, selector, containerSelector]);
}