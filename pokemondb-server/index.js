const express = require("express");
const path = require('path');
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();
const { errors } = require("celebrate");
const { MONGO_URL } = require("./utils/config");
const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const limiter = require("./utils/rateLimiter");

const app = express();
const { PORT = 3002 } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.use(express.static(path.join(__dirname, "../pokemondb")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../pokemondb/index.html"));
});
app.use(
  cors({
    origin: "https://pokefinal.jumpingcrab.com",
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

app.get("/ping", (req, res) => {
  console.log("Ping route reached!");
  res.send("pong");
});

app.get('/test-backend', (req, res) => {
  console.log('Test backend route hit!');
  res.json({ message: 'Backend changes are live!' });
});


app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});

