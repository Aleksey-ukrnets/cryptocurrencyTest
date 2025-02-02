import axios from "axios";

const API_KEY = "c084c2e0-8b36-4485-878a-0a50a46a11ff";
//Можно создавать в целом const с урлами по которым делаем запрос, также ключи все хранить в env
//Просто написал, чтобы имели ввиду, что я это понимаю, а так как это тестовое, уже не делал это
const coinMarketCapApi = axios.create({
  baseURL: import.meta.env.VITE_DEV ? "/api" : window.location.origin,
  headers: { "X-CMC_PRO_API_KEY": API_KEY },
});

export const getCryptocurrencies = async () => {
  const response = await coinMarketCapApi.get("/v1/cryptocurrency/map");
  console.log(response, "response");
  return response.data;
};

export const getExchangeRate = async (fromId: number, toId: number) => {
  const [fromResponse, toResponse] = await Promise.all([
    coinMarketCapApi.get(`/v1/cryptocurrency/quotes/latest?id=${fromId}`),
    coinMarketCapApi.get(`/v1/cryptocurrency/quotes/latest?id=${toId}`),
  ]);

  const fromUSD = fromResponse.data.data[fromId].quote.USD.price;
  const toUSD = toResponse.data.data[toId].quote.USD.price;

  return fromUSD / toUSD;
};
