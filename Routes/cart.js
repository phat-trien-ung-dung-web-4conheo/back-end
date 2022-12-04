const Cart = require("../Models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  // const existingProductIndex = Cart.products.findIndex(
  //   (product) => product.productId === req.body.products[0].productId
  // );

  //Is product already in cart?
  const existingProduct = await Cart.find({
    $and: [
      { "products.productId": req.body.products[0].productId },
      { "products.size": req.body.products[0].size },
      { userId: req.body.userId },
      { "products.color": req.body.products[0].color },
    ],
  });
  if (existingProduct.length) {
    const productQuantity = existingProduct[0].products[0].quantity;

    console.log(
      "🚀 ~ file: cart.js:26 ~ router.post ~ productQuantity",
      productQuantity
    );
    const updatedProduct = await Cart.findOneAndUpdate(
      {
        $and: [
          { "products.productId": req.body.products[0].productId },
          { "products.size": req.body.products[0].size },
          { userId: req.body.userId },
          { "products.color": req.body.products[0].color },
        ],
      },
      req.body.products[0].quantity > 1
        ? {
            $set: {
              "products.$.quantity":
                req.body.products[0].quantity + productQuantity,
            },
          }
        : { $inc: { "products.$.quantity": 1 } },
      {
        //To get the updated product for database and frontend
        new: true,
      }
    );
    const findProduct = await Cart.find({
      "products.userId": req.body.userId,
    });
    console.log("findProduct: ", findProduct);
    updatedProduct.totalPrice = updatedProduct.products.reduce(
      (total, item) => (findProduct ? total + item.price * item.quantity : 0),
      0
    );
    try {
      const savedCart = await updatedProduct.save();
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    try {
      const newCart = new Cart(req.body);
      // console.log("newCart ", newCart);

      newCart.totalPrice = newCart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      console.log("newCart.totalPrice 123", newCart.totalPrice);
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  console.log(
    "🚀 ~ file: cart.js:20 ~ router.post ~ existingProduct.length",
    existingProduct
  );

  // const updateTotalPrice = await Cart.findOneAndUpdate();
});
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      //TO GET THE UPDATED Cart
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
