const UserModel = require("../models/UserModel");
const { verifyToken, generateToken } = require("../utils/jwtUtil");
const { generatePassword, verifyPassword } = require("../utils/passwordUtil");
const { errorCreator, responseCreator } = require("../utils/responseHandler");

const signupController = async (req, res, next) => {
	try {
		const userData = req.body;
		const { password: userPassword } = userData;
		const hashedPassword = await generatePassword(userPassword);
		const user = await UserModel.createUser({
			...userData,
			password: hashedPassword,
		});
		if (!user) {
			errorCreator("User Signup Failed", 401);
		}
		res
			.status(201)
			.send(responseCreator("User Signed Up Successfully !", user));
	} catch (error) {
		next(error);
	}
};

const loginController = async (req, res, next) => {
	try {
		const userData = req.body;
		const { username, password } = userData;
		const user = await UserModel.findUser(username);
		const { password: hashedPassword, ...data } = user;
		const isPasswordSame = await verifyPassword(password, hashedPassword);
		if (!isPasswordSame) {
			errorCreator("Invalid Credentials", 402);
		}
		const token = generateToken(data);
		res.status(200);
		res.cookie("authToken", token, {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		res.send(responseCreator("User LoggedIn Successfully !", user));
	} catch (error) {
		next(error);
	}
};

const loginWithTokenController = async (req, res, next) => {
	try {
		const { authToken } = req.cookies || {};

		const { username } = verifyToken(authToken);
		const user = await UserModel.findUser(username);
		res.status(200);
		res.send(responseCreator("Logged In With Token", user));
	} catch (error) {
		next(error);
	}
};

const logoutController = async (req, res, next) => {
	res.clearCookie("authToken");
	res.status(200).send(responseCreator("LoggedOutSuccessfully", {}));
};

module.exports = {
	loginController,
	signupController,
	loginWithTokenController,
	logoutController,
};
