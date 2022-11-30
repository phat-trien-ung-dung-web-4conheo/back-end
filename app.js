const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//IMPORT ROUTES
const authRoute = require("./Routes/auth");
const users = require("./Routes/user");
const productRoute = require("./Routes/product");
const cartRoute = require("./Routes/cart");
const orderRoute = require("./Routes/order");
//CONNECT TO DB
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

//ROUTE MIDDLEWARE
app.use("/api/users", users);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
//MIDLEWARE
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started ${port}`));
