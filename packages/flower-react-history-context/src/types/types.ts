export type HistoryContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  isActive: true;
};

export type FallbackHistoryContext = {
    index: number;
    setIndex: (newIndex: number) => void;
    isActive: false;
  };