import { Autocomplete, TextField } from "@mui/material";
import { CryptoCurrency } from "shared/store/ExchangeStore/ExchangeStore";

interface CurrencySelectProps {
  currencies: CryptoCurrency[];
  selectedCurrency: CryptoCurrency | null;
  onChange: (currency: CryptoCurrency) => void;
}

const CurrencySelect = ({
  currencies,
  selectedCurrency,
  onChange,
}: CurrencySelectProps) => {
  return (
    <Autocomplete
      options={currencies}
      getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
      value={selectedCurrency}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.symbol} - {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Выберите валюту" variant="outlined" />
      )}
      fullWidth
    />
  );
};

export default CurrencySelect;
