
import React, { createContext, useState, useContext, ReactNode } from 'react';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate compared to USD (1 USD = X of this currency)
  decimalPlaces: number;
}

const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1, decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.93, decimalPlaces: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.79, decimalPlaces: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 149.70, decimalPlaces: 0 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.37, decimalPlaces: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 1.52, decimalPlaces: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', exchangeRate: 7.26, decimalPlaces: 2 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currencyCode: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
  convertToCurrency: (amountInUSD: number) => number;
  convertFromCurrency: (amountInCurrentCurrency: number) => number;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies.USD);
  const availableCurrencies = Object.values(currencies);

  const setCurrency = (currencyCode: CurrencyCode) => {
    setCurrencyState(currencies[currencyCode]);
  };

  const formatCurrency = (amount: number): string => {
    const formattedAmount = amount.toFixed(currency.decimalPlaces);
    return `${currency.symbol}${formattedAmount}`;
  };

  const convertToCurrency = (amountInUSD: number): number => {
    return amountInUSD * currency.exchangeRate;
  };

  const convertFromCurrency = (amountInCurrentCurrency: number): number => {
    return amountInCurrentCurrency / currency.exchangeRate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        convertToCurrency,
        convertFromCurrency,
        availableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
