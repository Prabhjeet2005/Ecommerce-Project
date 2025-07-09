const { sign, verify } = require("jsonwebtoken");
const { errorCreator } = require("./responseHandler");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (userData, time = "1d") => {
	const { username,role } = userData;
	const token = sign({username,role}, JWT_SECRET_KEY, { expiresIn: time });
	return token;
};

const verifyToken = (token) => {
	if (!token) {
		errorCreator("Token Missing");
	}
	const verifiedToken = verify(token, JWT_SECRET_KEY);
	return verifiedToken;
};

module.exports = { generateToken, verifyToken };
