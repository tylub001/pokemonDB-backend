const mongoose = require("mongoose");

const pokemonCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(url),
      message: "Invalid image URL"
    }
  },
  isLegendary: {
    type: Boolean,
    default: false
  },
  isMythical: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("PokemonCard", pokemonCardSchema);