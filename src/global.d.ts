declare interface Essay {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    class: string;
  };
  scores: number[];
  comments: string[];
  paragraphComments: string[];
  sents: string[][];
  good_sents: Sent[];
  sick_sents: SickSent[];
  sent_relations: SendRelation[];
  good_words: GoodWord[];
  textCorrections: TextCorrection[];

  lines: number;
  good_sents_arranged: Sent[][];
  sick_sents_arranged: SickSent[][];
  sent_relations_arranged: SendRelation[][];
  good_words_arranged: GoodWord[][][];
  textCorrections_arranged: TextCorrection[][];
}

declare interface Window {
  ESSAYS_DEF: Essay[];
  VIDEO_NAMES_DEF: string[];
}
