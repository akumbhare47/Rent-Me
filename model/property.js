const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  beds: {
    type: Number,
    min: 1,
  },
  bathrooms: {
    type: Number,
    min: 1,
  },
  area: {
    type: Number,
    min: 100,
  },
  type: {
    type: String,
    enum: {
      values: ["Bunglows", "PGs", "OYO", "Dormitories", "Flats"],
      message: `{VALUE} not supported.`,
    },
  },
});

module.exports = mongoose.model("Property", PropertySchema);
