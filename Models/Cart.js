const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    userId: {
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
        title: {
          type: String,
          required: true,
          unique: true,
        },
        desc: {
          type: String,
          required: true,
        },
        img: {
          type: Array,
          required: true,
        },
        categories: {
          type: Array,
          required: true,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
  //Mongoose have already created a field timestamps, so we don't need to create it again with createdAt
);

module.exports = mongoose.model("Cart", CartSchema);
