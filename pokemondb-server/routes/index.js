const router = require("express").Router();
const { MESSAGES } = require("../utils/errors");
const NotFoundError = require("../utils/NotFoundError");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateAuth,
  validateRegistration,
} = require("../middlewares/validator");

const userRouter = require("./users");
const pokemonRouter = require("./pokemon");

router.post("/signup", validateRegistration, createUser);
router.post("/signin", validateAuth, login);

router.use(auth);

router.use("/users", userRouter);
router.use("/pokemon", pokemonRouter);

router.use((req, res, next) => next(new NotFoundError(MESSAGES.NOT_FOUND)));
module.exports = router;
