const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate");
const { MONGO_URL } = require("./utils/config");
const mainRouter = require("./routes/index");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const limiter = require("./utils/rateLimiter");

const app = express();
const { PORT = 3000 } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);


app.use(cors())
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

app.get("/ping", (req, res) => {
  console.log("Ping route reached!");
  res.send("pong");
});

app.get("/test-backend", (req, res) => {
  console.log("Test backend route hit!");
  res.json({ message: "Backend changes are live!" });
});

app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
