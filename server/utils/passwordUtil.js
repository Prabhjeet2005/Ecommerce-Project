const { compare, genSalt, hash } = require("bcrypt");

const generatePassword = async (password) => {
	const salt = await genSalt();
	const hashedPassword = await hash(password, salt);
	return hashedPassword;
};

const verifyPassword = async (password,hashedPassword)=>{
  const isPasswordSame = await compare(password,hashedPassword);
  return isPasswordSame;
}

module.exports = {generatePassword,verifyPassword}