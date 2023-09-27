const express = require("express");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();
const {
  getAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  myProperty,
  signUp,
  login,
} = require("../controller/apiController");

router.get("/list-properties", getAllProperties);
router.post("/property", authenticateToken, addProperty);
router.put("/property/:id", authenticateToken, updateProperty);
router.delete("/property/:id", authenticateToken, deleteProperty);
router.get("/property", authenticateToken, myProperty);
router.post("/signup", signUp);
router.post("/login", authenticateToken, login);

module.exports = router;
