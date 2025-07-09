const {
	Schema,
	model,
	Types: { Decimal128 },
} = require("mongoose");
const { errorCreator } = require("../utils/responseHandler");
const ProductModel = require("./ProductModel");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is Mandatory !"],
		},
		email: {
			type: String,
			required: [true, "Email is Mandatory !"],
			unique: true,
		},
		username: {
			type: String,
			required: [true, "Username is Mandatory !"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is Mandatory !"],
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
		totalCount: {
			type: Number,
			default: 0,
		},
		totalValue: {
			type: Decimal128,
			set: (value) => new Decimal128(value.toFixed(2)),
			get: (value) => parseFloat(value),
			default: 0,
		},
		cart: [
			{
				product: {
					// Stores just the ID
					type: Schema.Types.ObjectId,
					ref: "product",
					required: true,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
	},
	{
		toObject: { getters: true },
	}
);

userSchema.statics.createUser = async (userData) => {
	const { username } = userData;
	const duplicateUser = await UserModel.findOne({ username });
	if (duplicateUser) {
		errorCreator("User Already Exists", 401);
	}
	const user = await UserModel.create(userData);
	return user;
};

userSchema.statics.findUser = async (username) => {
	const user = (
		await UserModel.findOne({ username }, { _id: 0, __v: 0 })
	)?.toObject();
	if (!user) {
		errorCreator("User Not Found", 401);
	}
	return user;
};

userSchema.statics.updatePassword = async (username, password) => {
	const updatedPassword = await UserModel.findOneAndUpdate(
		{ username },
		{ $set: { password } },
		{ new: true }
	);
	if (updatedPassword) {
		return `Password Successfully Updated`;
	}
};

const sanitizedUserData = (userData) => {
	const { id, secret, password, __v, _id, ...data } = userData?.toObject();

	return data;
};

/*
_id -> findById => MongoDB ID
id -> CustomId -> Product Model Unique Id
*/

// const {quantity} = await UserModel.findOne({username,"cart.id":product.id})
userSchema.statics.addToCart = async (username, _id) => {
	const product = await ProductModel.findById(_id); // MongoDB ID
	if (!product) {
		errorCreator("Product Doesn't Exist", 400);
	}

	const user = await UserModel.findOne({ username });
	const alreadyAddedToCart = user.cart.find(
		(item) => item.product.toString() === _id.toString()
	);
	if (alreadyAddedToCart) {
		return await UserModel.increment(username, _id);
	}

	const userData = await UserModel.findOneAndUpdate(
		{ username },
		{
			$push: { cart: { product: product._id, quantity: 1 } },
			$inc: { totalCount: 1, totalValue: product.price },
		},
		{ new: true }
	).populate("cart.product");
	return sanitizedUserData(userData);
};

userSchema.statics.getCartItems = async (username) => {
	const data = await UserModel.findOne(
		{
			username,
		},
		{ cart: 1, totalCount: 1, totalValue: 1 }
	).populate("cart.product");

	return sanitizedUserData(data);
};

userSchema.statics.clearCart = async (username) => {
	const userData = await UserModel.findOneAndUpdate(
		{ username },
		{ $set: { cart: [], totalCount: 0, totalValue: 0 } },
		{ new: true }
	);
	return sanitizedUserData(userData);
};

// RETRIVING cart.id [NO $ REQUIRED]
// UPDATING cart.$.quantity [$ REQUIRED]
userSchema.statics.increment = async (username, _id) => {
	const exisitingProduct = await ProductModel.findById(_id);
	if (!exisitingProduct) {
		errorCreator("Product Doesn't Exist", 400);
	}
	const user = await UserModel.findOne({ username });
	const alreadyAddedToCart = user.cart.find(
		item => item.product._id.toString() === _id.toString()
	)
	if(!alreadyAddedToCart){
		return await UserModel.addToCart(username,_id)
	}
	const userData = await UserModel.findOneAndUpdate(
		{ username, "cart.product": _id },
		{
			$inc: {
				"cart.$.quantity": 1,
				totalCount: 1,
				totalValue: exisitingProduct.price,
			},
		},
		{ new: true }
	).populate("cart.product");
	return sanitizedUserData(userData);
};

userSchema.statics.decrement = async (username, _id) => {
	const exisitingProduct = await ProductModel.findById(_id);
	if (!exisitingProduct) {
		errorCreator("Product Doesn't Exist", 404);
	}
	//BACKEND Find Quantity
	const user = await UserModel.findOne({
		username,
		"cart.product": _id,
	}).populate("cart.product");
	
	if(!user){
		errorCreator("Cart Is Empty",404)
	}
	const cartItem = user.cart.find(
		(item) => item.product._id.toString() === _id.toString()
	);
	const quantity = cartItem?.quantity;

	if (quantity <= 1) {
		return await UserModel.removeFromCart(username, _id);
	}

	const userData = await UserModel.findOneAndUpdate(
		{
			username,
			"cart.product": _id,
		},
		{
			$inc: {
				"cart.$.quantity": -1,
				totalCount: -1,
				totalValue: -exisitingProduct.price,
			},
		},
		{ new: true }
	).populate("cart.product");
	return sanitizedUserData(userData);
};

userSchema.statics.removeFromCart = async (username, _id) => {
	const existingProduct = await ProductModel.findById(_id);
	if (!existingProduct) {
		errorCreator("Product Doesn't Exist", 404);
	}
	const user = await UserModel.findOne({
		username,
		"cart.product": _id,
	});

	if(!user){
		errorCreator("Cart is Empty",400)
	}

	const cartItem = user.cart.find(
		(item) => item.product._id.toString() === _id.toString()
	);
	const cartItemQty = cartItem?.quantity;

	const userData = await UserModel.findOneAndUpdate(
		{ username },
		{
			$inc: {
				totalCount: -cartItemQty,
				totalValue: -existingProduct.price * cartItemQty,
			},
			$pull: {
				cart: { product:_id },
			},
		},
		{ new: true }
	).populate("cart.product");
	return sanitizedUserData(userData);
};
const UserModel = model("users", userSchema);

module.exports = UserModel;
