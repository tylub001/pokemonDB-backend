const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const helmet = require('helmet');
require("dotenv").config();
const { MONGO_URL } = require("./utils/config");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const limiter = require('./utils/rateLimiter');


const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
