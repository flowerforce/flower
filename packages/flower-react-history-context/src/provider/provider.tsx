import React, { createContext, useContext, useState } from 'react';
import { FallbackHistoryContext, HistoryContextType } from '../types';



const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [index, setIndex] = useState<number>(0);

  return (
    <HistoryContext.Provider value={{ index, setIndex, isActive: true }}>
      {children}
    </HistoryContext.Provider>
  );
};



export const useHistoryContext = (): HistoryContextType | FallbackHistoryContext => {
  const ctx = useContext(HistoryContext);

  if (ctx) return ctx;

  // fallback per quando il provider non è montato
  return {
    index: 0,
    setIndex: () => {},
    isActive: false,
  };
};
