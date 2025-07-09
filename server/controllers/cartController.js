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
		const {_id} = req.body;

		const addedCart = await UserModel.addToCart( username,_id);

		const addedItem = addedCart.cart.find(
			item=>item.product._id.toString() === _id.toString()
		)
		const title = addedItem.product.title || "Product"
		res
			.status(200)
			.send(
				responseCreator(
					`${title} added to cart Successfully`,
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
		const {_id} = req.body;
	
		const userData = await UserModel.decrement(username, _id);
		
		const decrementedProductFromCart = userData.cart.find(
			item => item.product._id.toString() === _id.toString()
		) 
		const title = decrementedProductFromCart?.product?.title || "Product"
		res
			.status(200)
			.send(responseCreator(`${title} decremented from cart`, userData));
	} catch (error) {
		next(error);
	}
};
const incrementController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const {_id} = req.body;
		const incrementedCart = await UserModel.increment(username, _id);

		const productIncremented = incrementedCart.cart.find(
			item => item.product._id.toString() === _id.toString()
		)
		const title = productIncremented?.product?.title || "Product"
		res
			.status(200)
			.send(responseCreator(`${title} incremented to cart`, incrementedCart));
	} catch (error) {
		next(error);
	}
};

const removeFromCartController = async (req, res, next) => {
	try {
		const { username } = res.locals.user;
		const {_id} = req.body;

		const userData = await UserModel.removeFromCart(username, _id);
		res
			.status(200)
			.send(
				responseCreator(
					`Product is Removed From Cart Successfully`,
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
