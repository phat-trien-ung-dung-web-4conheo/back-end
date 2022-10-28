const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
//IMPORT ROUTES
const authRoute = require("./routes/auth");

//MIDLEWARE
app.use(express.json());
app.use("/login", authRoute);
//ROUTES
app.get("/", (req, res) => {
  res.send("we are on home");
});

//CONECT TO DB
mongoose
  .connect(process.env.MONGO_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
app.listen(3000, () => console.log("Server started"));
