import { create } from 'zustand';

import { ESSAYS as es } from './essays';

export const ESSAYS = es;

const emptyEssay = {
  id: -1,
  title: '',
  author: {
    name: '',
    class: ''
  },
  content: '',
  scores: [0, 0, 0, 0, 0, 0],
  comments: ['', '', '', '', '', ''],
  paragraphComments: [],
  sents: [],
  good_sents: [],
  sick_sents: [],
  sent_relations: [],
  good_words: [],
  textCorrections: [],

  lines: 0,
  good_sents_arranged: [],
  sick_sents_arranged: [],
  sent_relations_arranged: [],
  good_words_arranged: [],
  textCorrections_arranged: []
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
      set({ essay: ESSAYS[idx], viewIdx: 0, essayIdx: idx });
      // setTimeout(() => {
      //   set({ essay: ESSAYS[idx] });
      // }, 0);
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

interface VideoState {
  idx: number;
  videoName: string;
  toggleVideo: () => void;
}

const VIDEO_NAMES = window.VIDEO_NAMES_DEF;

const defIdx = 0;

export const useBgVideo = create<VideoState>((set, get) => ({
  idx: defIdx,
  videoName: VIDEO_NAMES[defIdx],
  toggleVideo: () => {
    let targetIdx = get().idx + 1;
    targetIdx %= VIDEO_NAMES.length;
    set({ idx: targetIdx, videoName: VIDEO_NAMES[targetIdx] });
  }
}));

interface DisplayModeState {
  idx: number;
  toggleDisplayMode: () => void;
}

enum DisplayMode {
  DEFAULT = 0,
  LARGE = 1
}

export const useDisplayMode = create<DisplayModeState>((set, get) => ({
  idx: DisplayMode.DEFAULT,
  toggleDisplayMode: () => {
    set({ idx: (get().idx + 1) % 2 });
  }
}));
