const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

//IMPORT ROUTES
const authRoute = require("./routes/auth");
//CONECT TO DB
mongoose
  .connect(process.env.MONGO_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

//ROUTES
app.get("/", (req, res) => {
  res.send("we are on home");
});

//MIDLEWARE
app.use(express.json());

//ROUTE MIDDLEWARE
app.use("/user", authRoute);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started ${port}`));
