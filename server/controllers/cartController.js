const UserModel = require("../models/UserModel");
const { responseCreator } = require("../utils/responseHandler");

// {
//   "id": 1,
//   "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
//   "price": 109.95,
//   "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
//   "category": "men's clothing",
//   "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
//   "rating": {
//     "rate": 3.9,
//     "count": 120
//   },
//  quantity: 1
// }

const addToCartController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const product = req.body;
		const addedCart = await UserModel.addToCart(product, username);
		res
			.status(200)
			.send(
				responseCreator(
					`${product.title} added to cart Successfully`,
					addedCart
				)
			);
	} catch (error) {
		next(error);
	}
};

const getCartItemsController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const userData = await UserModel.getCartItems(username);
		res
			.status(200)
			.send(responseCreator("Cart Fetched Successfully", userData));
	} catch (error) {
		next(error);
	}
};

const clearCartController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const cartItems = await UserModel.clearCart(username);
		res
			.status(200)
			.send(responseCreator("Cart Cleared Successfully", cartItems));
	} catch (error) {
		next(error);
	}
};

const decrementController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const product = req.body;
		const userData = await UserModel.decrement(username, product);
		res
			.status(200)
			.send(responseCreator(`${product.title} decremented to cart`, userData));
	} catch (error) {
		next(error);
	}
};
const incrementController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const product = req.body;
		const userData = await UserModel.increment(username, product);
		res
			.status(200)
			.send(responseCreator(`${product.title} incremented to cart`, userData));
	} catch (error) {
		next(error);
	}
};

const removeFromCartController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const product = req.body;
		const userData = await UserModel.removeFromCart(username, product);
		res
			.status(200)
			.send(
				responseCreator(
					`${product.title} is Removed From Cart Successfully`,
					userData
				)
			);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addToCartController,
	getCartItemsController,
	clearCartController,
	incrementController,
	decrementController,
	removeFromCartController,
};
