const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
	addToCartController,
	getCartItemsController,
  clearCartController,
  incrementController,
  decrementController,
  removeFromCartController,
} = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.get("/getCartItems", authMiddleware, getCartItemsController);
cartRouter.post("/addToCart", authMiddleware, addToCartController);
cartRouter.put("/clearCart", authMiddleware, clearCartController);
cartRouter.patch("/increment",authMiddleware, incrementController);
cartRouter.patch("/decrement",authMiddleware,decrementController);
cartRouter.patch("/removeFromCart", authMiddleware, removeFromCartController);

module.exports = cartRouter;
