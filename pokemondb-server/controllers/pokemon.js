const PokemonCard = require("../models/pokemon");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const ForbiddenError = require("../utils/ForbiddenError");
const { MESSAGES } = require("../utils/errors");

const getPokemonCards = (req, res, next) => {
  PokemonCard.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      console.error("Error fetching cards:", err);
      next(err);
    });
};

const getMyPokemonCards = (req, res, next) => {
  PokemonCard.find({ owner: req.user._id })
    .then((cards) => res.status(200).json(cards))
    .catch((err) => {
      console.error("Error fetching user cards:", err);
      next(err);
    });
};

const createPokemonCard = (req, res, next) => {
  const { name, description, image, isLegendary, isMythical } = req.body;
  const owner = req.user._id;

  PokemonCard.create({
    name,
    description,
    image,
    isLegendary,
    isMythical,
    owner,
  })
    .then((card) => {
      res.status(201).json(card);
    })
    .catch((err) => {
      console.error("Error saving card:", err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST));
      }
      return next(err);
    });
};

const deletePokemonCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  PokemonCard.findById(cardId)
    .orFail(() => new NotFoundError(MESSAGES.ITEM_NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        return next(new ForbiddenError(MESSAGES.FORBIDDEN));
      }

      return card.deleteOne().then(() => {
        res
          .status(200)
          .json({ message: "Card deleted successfully", deletedCard: card });
      });
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      if (err.name === "CastError") {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST));
      }
      return next(err);
    });
};

module.exports = {
  getPokemonCards,
  getMyPokemonCards,
  createPokemonCard,
  deletePokemonCard,
};
