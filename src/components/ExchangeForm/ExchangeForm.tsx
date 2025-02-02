import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { exchangeStore } from "shared/store/ExchangeStore/ExchangeStore";

import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CurrencySelect from "components/CurrencySelect/CurrencySelect";
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
const ExchangeForm = observer(() => {
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");

  useEffect(() => {
    exchangeStore.fetchCryptocurrencies();
  }, []);

  const handleFromInputChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);
    if (value === "" || isNaN(numberValue)) {
      setFromError("Введите число");
      exchangeStore.setFromAmount(0);
    } else if (numberValue <= 0) {
      setFromError("Введите положительное число");
    } else {
      setFromError("");
      exchangeStore.setFromAmount(numberValue);
    }
  };

  const handleToInputChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);
    if (value === "" || isNaN(numberValue)) {
      setToError("Введите число");
      exchangeStore.setToAmount(0);
    } else if (numberValue <= 0) {
      setToError("Введите положительное число");
    } else {
      setToError("");
      exchangeStore.setToAmount(numberValue);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Криптовалютный обменник
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Отдаёте</Typography>
        <TextField
          label="Сумма"
          type="number"
          variant="outlined"
          value={exchangeStore.fromAmount || ""}
          onChange={handleFromInputChange}
          error={!!fromError}
          helperText={fromError}
          fullWidth
          InputProps={{
            endAdornment: exchangeStore.loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
        />
        <CurrencySelect
          currencies={exchangeStore.cryptocurrencies}
          selectedCurrency={exchangeStore.fromCurrency}
          onChange={(currency) => exchangeStore.setFromCurrency(currency)}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => exchangeStore.reverseCurrencies()}
        >
          Реверс валют
        </Button>
        <Typography variant="h6">Получаете</Typography>
        <TextField
          label="Сумма"
          type="number"
          variant="outlined"
          value={exchangeStore.toAmount || ""}
          onChange={handleToInputChange}
          error={!!toError}
          helperText={toError}
          fullWidth
          InputProps={{
            endAdornment: exchangeStore.loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
        />
        <CurrencySelect
          currencies={exchangeStore.cryptocurrencies}
          selectedCurrency={exchangeStore.toCurrency}
          onChange={(currency) => exchangeStore.setToCurrency(currency)}
        />
        <Typography variant="body1">
          Курс обмена:{" "}
          {exchangeStore.exchangeRate
            ? exchangeStore.exchangeRate.toFixed(4)
            : "—"}
        </Typography>
        {exchangeStore.error && (
          <Typography variant="body2" color="error">
            {exchangeStore.error}
          </Typography>
        )}
      </Box>
    </Box>
  );
});

export default ExchangeForm;
