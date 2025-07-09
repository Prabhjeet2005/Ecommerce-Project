const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addProductController, deleteProductController, updateProductController, getProductItemsController } = require("../controllers/productController");
const isAdminMiddleware = require("../middleware/isAdminMiddleware");

const productRouter = express.Router();

productRouter.get("/getProductItems", getProductItemsController);
productRouter.post(
	"/addProduct",
	authMiddleware,
	isAdminMiddleware,
	addProductController
);
productRouter.put(
	"/deleteProduct",
	authMiddleware,
	isAdminMiddleware,
	deleteProductController
);
productRouter.patch(
	"/updateProduct",
	authMiddleware,
	isAdminMiddleware,
	updateProductController
);

module.exports = productRouter;
