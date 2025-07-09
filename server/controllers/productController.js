const ProductModel = require("../models/ProductModel");
const { responseCreator } = require("../utils/responseHandler");

const getProductItemsController = async (req, res, next) => {
	try {
		const products = await ProductModel.getAllProducts();
		res.status(200).send(responseCreator("Getting All Products", products));
	} catch (error) {
		next(error);
	}
};

const addProductController = async (req, res, next) => {
	try {
		const product = req.body;
		const addedProduct = await ProductModel.addProduct(product);
		res
			.status(201)
			.send(
				responseCreator(`${product.title} created Successfully`, addedProduct)
			);
	} catch (error) {
		next(error);
	}
};

const deleteProductController = async (req, res, next) => {
	try {
		const product = req.body;
		const deletedProduct = await ProductModel.deleteProduct(product);
		res.status(200).send(responseCreator(deletedProduct, {}));
	} catch (error) {
		next(error);
	}
};

const updateProductController = async (req, res, next) => {
	try {
    const product = req.body;
    	const updatedProduct = await ProductModel.updateProduct(product);
    	res
    		.status(200)
    		.send(
    			responseCreator(
    				`${product.title} is updated Successfully!`,
    				updatedProduct
    			)
    		);
  } catch (error) {
    next(error)
  }
};

module.exports = {
	getProductItemsController,
	addProductController,
	deleteProductController,
	updateProductController,
};
