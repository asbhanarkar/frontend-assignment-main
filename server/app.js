// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.enable("trust proxy");

async function fetchTradeStatistics(symbol, date) {
  try {
    const apiKey = "jV9iMjITgDPaZuh2mhsDZkJWYpQiD1T7";
    const formattedDate = date.toISOString().split("T")[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedDate}/${formattedDate}?apiKey=${apiKey}`;

    const response = await axios.get(url);
    const { results } = response.data;
    if (results.length === 0) {
      throw new Error("No trade data found for the specified stock and date.");
    }

    const tradeStats = {
      open: results[0].o,
      high: results[0].h,
      low: results[0].l,
      close: results[0].c,
      volume: results[0].v,
    };

    return tradeStats;
  } catch (error) {
    throw new Error(
      "Error fetching trade statistics. Please check the stock symbol and date."
    );
  }
}

app.post("/api/fetchStockData", async (req, res) => {
  const { symbol, date } = req.body;

  try {
    const tradeStats = await fetchTradeStatistics(symbol, new Date(date));
    res.status(200).json(tradeStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
