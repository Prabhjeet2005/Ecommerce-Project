const {
	Schema,
	model,
	Types: { Decimal128 },
} = require("mongoose");
const { errorCreator } = require("../utils/responseHandler");

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
		totalCount: {
			type: Number,
		},
		totalValue: {
			type: Decimal128,
			set: (value) => new Decimal128(value.toFixed(2)),
			get: (value) => parseFloat(value),
			default: 0,
		},
		cart: [Object],
	},
	{
		toObject: { getters: true },
	}
);

userSchema.statics.createUser = async (userData) => {
	const { username } = userData;
	const duplicateUser = await UserModel.findUser(username);
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

// const {quantity} = await UserModel.findOne({username,"cart.id":product.id})
userSchema.statics.addToCart = async (product, username) => {
	const userData = await UserModel.findOneAndUpdate(
		{ username },
		{
			$push: { cart: { ...product, quantity: 1 } },
			$inc: { totalCount: 1, totalValue: product.price },
		},
		{ new: true }
	);
	return sanitizedUserData(userData);
};

userSchema.statics.getCartItems = async (username) => {
	const data = await UserModel.findOne(
		{
			username,
		},
		{ cart: 1, totalCount: 1, totalValue: 1 }
	);

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
userSchema.statics.increment = async (username, product) => {
	const userData = await UserModel.findOneAndUpdate(
		{ username, "cart.id": product.id },
		{
			$inc: {
				"cart.$.quantity": 1,
				totalCount: 1,
				totalValue: product.price,
			},
		},
		{ new: true }
	);
	return sanitizedUserData(userData);
};

userSchema.statics.decrement = async (username, product) => {
	//BACKEND Find Quantity
	const user = await UserModel.findOne({
		username,
		"cart.id": product.id,
	});

	const cartItem = user.cart.find((e) => e.id === product.id);
	const quantity  = cartItem?.quantity;

	if (quantity <= 1) {
		const data = await UserModel.removeFromCart(username, product);
		return sanitizedUserData(data);
	}
	const userData = await UserModel.findOneAndUpdate(
		{
			username,
			"cart.id": product.id,
		},
		{
			$inc: {
				"cart.$.quantity": -1,
				totalCount: -1,
				totalValue: -product.price,
			},
		},
		{ new: true }
	);
	return sanitizedUserData(userData);
};

userSchema.statics.removeFromCart = async (username, product) => {
	const user = await UserModel.findOne({
		username,
		"cart.id": product.id,
	});

	const cartItem = user.cart.find((e) => e.id === product.id);
	const quantity = cartItem?.quantity;

	const userData = await UserModel.findOneAndUpdate(
		{ username },
		{
			$inc: {
				totalCount: -quantity,
				totalValue: -product.price * quantity,
			},
			$pull: {
				cart: { id: product.id },
			},
		},
		{ new: true }
	);
	return sanitizedUserData(userData);
};

const UserModel = model("users", userSchema);
module.exports = UserModel;
