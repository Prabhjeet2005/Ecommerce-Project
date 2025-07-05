const { Schema, model, Types: Decimal128 } = require("mongoose");
const { errorCreator } = require("../utils/responseHandler");

const userSchema = new Schema({
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
	cart: [Object],
});

userSchema.statics.createUser = async (userData) => {
	const {username} = userData;
	const duplicateUser = await UserModel.findUser(username);
	if(duplicateUser){
		errorCreator("User Already Exists",401)
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
  if(updatedPassword){
    return `Password Successfully Updated`;
  }
};

const UserModel = model("users", userSchema);
module.exports = UserModel;
