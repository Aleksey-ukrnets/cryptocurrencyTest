import { makeAutoObservable, runInAction } from "mobx";
import { getCryptocurrencies, getExchangeRate } from "shared/api/CMC";

export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
}

class ExchangeStore {
  cryptocurrencies: CryptoCurrency[] = [];
  fromCurrency: CryptoCurrency | null = null;
  toCurrency: CryptoCurrency | null = null;
  fromAmount: number = 0;
  toAmount: number = 0;
  exchangeRate: number = 0;
  loading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCryptocurrencies() {
    try {
      const data = await getCryptocurrencies();
      runInAction(() => {
        this.cryptocurrencies = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol,
        }));
        if (this.cryptocurrencies.length >= 2) {
          this.fromCurrency = this.cryptocurrencies[0];
          this.toCurrency = this.cryptocurrencies[1];
          this.updateExchangeRate();
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка загрузки списка криптовалют";
      });
    }
  }

  async updateExchangeRate() {
    if (!this.fromCurrency || !this.toCurrency) return;
    this.loading = true;
    try {
      const rate = await getExchangeRate(
        this.fromCurrency.id,
        this.toCurrency.id
      );
      runInAction(() => {
        this.exchangeRate = rate;

        this.calculateToAmount();
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка получения курса обмена";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setFromAmount(value: number) {
    if (value < 0) return;
    this.fromAmount = value;
    this.calculateToAmount();
  }

  setToAmount(value: number) {
    if (value < 0) return;
    this.toAmount = value;
    this.calculateFromAmount();
  }

  calculateToAmount() {
    if (this.exchangeRate && this.fromAmount) {
      this.toAmount = this.fromAmount * this.exchangeRate;
    } else {
      this.toAmount = 0;
    }
  }

  calculateFromAmount() {
    if (this.exchangeRate && this.toAmount) {
      this.fromAmount = this.toAmount / this.exchangeRate;
    } else {
      this.fromAmount = 0;
    }
  }

  setFromCurrency(currency: CryptoCurrency) {
    this.fromCurrency = currency;
    this.updateExchangeRate();
  }

  setToCurrency(currency: CryptoCurrency) {
    this.toCurrency = currency;
    this.updateExchangeRate();
  }

  reverseCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.updateExchangeRate();
  }
}

export const exchangeStore = new ExchangeStore();
