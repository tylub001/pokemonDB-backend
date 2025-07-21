const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
   return res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = authenticate;
