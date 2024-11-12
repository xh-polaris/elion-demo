import { GRID_COLS } from '../Page/PageContent/Essay/constants';

export const ORIGINAL_ESSAYS = window.ESSAYS_DEF;

type ParagraphId = {
  paragraph_id: number;
};

type Label = {
  label: string;
};

type SentId = {
  sent_id: number;
};

type ParagraphInterval = {
  start: number;
  end: number;
};

type Sent = ParagraphId & SentId & Label;
type SickSent = Sent & { revised_sent: string };
type TextCorrection = ParagraphId &
  SentId & {
    label: ('A' | 'R' | 'D')[];
    revised_sent: string;
    revised_token_idx: number[];
    token_idx: number[];
    corrections: string[];
  };

function calcLines(content: string, cols: number) {
  let lineCnt = 0;
  let charCnt = 2;
  for (let i = 0; i < content.length; i++) {
    if (content[i] !== '\n') {
      charCnt++;
      if (charCnt >= cols || i === content.length - 1) {
        lineCnt++;
        charCnt = 0;
      }
    } else {
      if (charCnt > 0) {
        lineCnt++;
      }
      charCnt = 2;
    }
  }

  return lineCnt;
}

function arrangeSents<T extends ParagraphId & SentId>(sents: Array<T>) {
  let res = [] as T[][];
  sents.forEach(sent => {
    if (!res[sent.paragraph_id]) {
      res[sent.paragraph_id] = [];
    }
    res[sent.paragraph_id][sent.sent_id] = sent;
  });
  // console.log(res);
  return res;
}

function arrangeSentArrays<T extends ParagraphId & SentId>(sents: Array<T>) {
  let res = [] as T[][][];
  sents.forEach(sent => {
    if (!res[sent.paragraph_id]) {
      res[sent.paragraph_id] = [];
    }
    if (!res[sent.paragraph_id][sent.sent_id]) {
      res[sent.paragraph_id][sent.sent_id] = [];
    }
    res[sent.paragraph_id][sent.sent_id].push(sent);
  });
  // console.log(res);
  return res;
}

function inferCorrections(sents: string[][], sick_sents: SickSent[]): TextCorrection[] {
  return sick_sents.map(({ revised_sent, paragraph_id, sent_id }) => {
    let res = {
      revised_sent,
      paragraph_id,
      sent_id,
      label: [] as string[],
      token_idx: [] as number[],
      revised_token_idx: [] as number[],
      corrections: [] as string[]
    };

    let originalSent = sents[paragraph_id][sent_id];
    let idx0, idx1;
    idx0 = idx1 = -1;
    while (!(idx0 > originalSent.length && idx1 > revised_sent.length)) {
      idx0++;
      idx1++;
      let originalChar = originalSent[idx0];
      let revisedChar = revised_sent[idx1];

      if (originalChar === revisedChar) {
      } else {
        let continueFlag = false;
        for (let i = 1; i <= 3; i++) {
          if (originalSent[idx0] === revised_sent[idx1 + i]) {
            res.label.push('A');
            res.token_idx.push(idx0 - 1);
            res.revised_token_idx.push(idx1);
            res.corrections.push(revised_sent.slice(idx1, idx1 + i));
            idx1 += i;
            continueFlag = true;
            break;
          }
        }
        if (continueFlag) {
          continue;
        }
        for (let i = 1; i <= 3; i++) {
          if (originalSent[idx0 + i] === revised_sent[idx1]) {
            for (let k = 1; k <= i; k++) {
              res.label.push('D');
              res.token_idx.push(idx0 + k - 1);
              res.revised_token_idx.push(idx1);
              res.corrections.push('');
            }
            idx0 += i;
            continueFlag = true;
            break;
          }
        }
        if (continueFlag) {
          continue;
        }
        res.label.push('R');
        res.token_idx.push(idx0);
        res.revised_token_idx.push(idx1);
        res.corrections.push(revised_sent[idx1]);
      }
    }

    return res;
  }) as TextCorrection[];
}

export const ESSAYS = ORIGINAL_ESSAYS.map(essay => {
  return {
    ...essay,
    textCorrections: inferCorrections(essay.sents, essay.sick_sents)
  };
}).map(essay => {
  let res = {
    ...essay,
    textCorrections: essay.textCorrections as TextCorrection[],
    lines: calcLines(essay.content, GRID_COLS),
    sent_relations_arranged: [],
    good_sents_arranged: arrangeSents(essay.good_sents),
    sick_sents_arranged: arrangeSents(essay.sick_sents),
    good_words_arranged: arrangeSentArrays(essay.good_words),
    textCorrections_arranged: arrangeSents(essay.textCorrections) as TextCorrection[][]
  };
  // essay.textCorrections.forEach(correction => {
  //   if (!res.sick_sents_arranged[correction.paragraph_id]) {
  //     res.sick_sents_arranged[correction.paragraph_id] = [];
  //   }
  //   if (!res.sick_sents_arranged[correction.paragraph_id][correction.sent_id]) {
  //     res.sick_sents_arranged[correction.paragraph_id][correction.sent_id] = {
  //       label: '错别字错误',
  //       paragraph_id: correction.paragraph_id,
  //       sent_id: correction.sent_id,
  //       revised_sent: ''
  //     };
  //   }
  // });
  return res;
});
