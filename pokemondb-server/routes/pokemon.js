const router = require("express").Router();
const {
  createPokemonCard,
  getMyPokemonCards,
  deletePokemonCard,
} = require("../controllers/pokemon");

const { validateCardBody, validateId } = require("../middlewares/validator");

router.post("/", validateCardBody, createPokemonCard);
router.get("/", getMyPokemonCards);
router.delete("/:cardId", validateId, deletePokemonCard);

module.exports = router;
