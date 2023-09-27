const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token == null) return res.status(401).send("Access denied.");

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");

    req.user = user; // Set req.user
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
