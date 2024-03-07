export const dimensionDescs = ['语言表达', '流畅程度', '逻辑结构', '审题立意', '内容充实']; //['语言表达', '行文流畅', '语篇连贯', '论述有力', '情感价值'];

export const animationDurations = {
  essay: 4,
  analysis: 3,
  pentagon: 3,
  battery: 3,
  comment: 2,
  scan: 3
};

export interface HighlightRange {
  start: number;
  length: number;
  color: string;
}
