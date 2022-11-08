const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
  //Mongoose have already created a field timestamps, so we don't need to create it again with createdAt
);

module.exports = mongoose.model("Cart", CartSchema);
