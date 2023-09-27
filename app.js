require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyparse = require("body-parser");
const api_routes = require("./routes/apiroute");
const { connectDB } = require("./db/connect");
const { Import } = require("./importDB");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hi");
});
try {
  Import();
} catch (error) {
  console.log(error);
}
app.use("/api", api_routes);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`live on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
