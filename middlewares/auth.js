const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user");
const { request } = require("express");

function generateAccessToken(user) {
  console.log("inside generate");
  console.log(user._id);
  console.log(user.email);
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
}
function authenticateToken(req, res, next) {
  console.log("inside auth");
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token == null) return res.status(401).send("Access denied.");

  const decode = jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");

    req.user = user; // Set req.user
    // next();
  });
  console.log(decode);
  next();
}

// async function authenticateToken(req, res, next) {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];

//   if (token == null) return res.status(401).send("Access denied.");
//   console.log(token);
//   console.log("here");
//   const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//   console.log(decoded);
//   const user = await User.findById({ _id: "6515bf3bcb729120bf9a7da6" });
//   console.log(user);
//   if (user) {
//     req.user = user;
//     next();
//   } else {
//     return res.status(403).send("Invalid token.");
//   }
// }

//     console.log(user);
//     if (user) {
//       req.user = user;
//       next();
//     } else {
//       return res.status(403).send("Invalid token.");
//     }
//   });
// }
// jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//   if (err)

//   req.user = user; // Set req.user
//   // console.log(user);
//   next();
// });

module.exports = {
  authenticateToken,
  generateAccessToken,
};
