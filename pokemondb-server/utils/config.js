require("dotenv").config();

const {
  JWT_SECRET = "super-strong-secret",
  MONGO_URL = "mongodb://127.0.0.1:27017/pokemondb",
} = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
