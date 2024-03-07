import { create } from 'zustand';

import { ESSAYS as es, type Essay } from './essays';

export const ESSAYS = es;

const emptyEssay = {
  id: -1,
  title: '',
  content: '',
  scores: [0, 0, 0, 0, 0, 0],
  comments: ['', '', '', '', '', ''],
  paragraphComments: [],
  sents: [],
  good_sents: [],
  sick_sents: [],
  sent_relations: [],
  good_words: [],

  lines: 0,
  good_sents_arranged: [],
  sick_sents_arranged: [],
  sent_relations_arranged: [],
  good_words_arranged: []
};

interface EssayState {
  essay: Essay;
  essayIdx: number;
  loadEssay: (idx: number) => void;
  viewIdx: number;
  changeViewIdx: (idx: number) => void;
}

export const useEssay = create<EssayState>((set, get) => ({
  essay: emptyEssay,
  essayIdx: -1,
  loadEssay: (idx: number) => {
    if (get().essayIdx !== idx) {
      set({ essay: emptyEssay, viewIdx: 0, essayIdx: idx });
      setTimeout(() => {
        set({ essay: ESSAYS[idx] });
      }, 0);
    }
  },
  viewIdx: 0,
  changeViewIdx: (idx: number) => set({ viewIdx: idx })
}));

interface DialogState {
  active: boolean;
  toggleActive: (newActive?: boolean) => void;
}

export const useDialog = create<DialogState>((set, get) => ({
  active: false,
  toggleActive: (newActive?: boolean) => {
    if (newActive === undefined) {
      set({ active: !get().active });
    } else {
      set({ active: newActive });
    }
  }
}));
