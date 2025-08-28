import React, { createContext, useContext } from 'react';
import useTransations from '../hooks/useTransations';

const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
  const value = useTransations();
  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactionsContext must be used within TransactionsProvider');
  return ctx;
};


