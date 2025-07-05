const UserModel = require("../models/UserModel");
const { generatePassword, verifyPassword } = require("../utils/passwordUtil");
const { errorCreator, responseCreator } = require("../utils/responseHandler");

const signupController = async (req, res, next) => {
	try {
    const userData = req.body;
    	const { password: userPassword } = userData;
    	const hashedPassword = await generatePassword(userPassword);
    	const user = await UserModel.createUser({...userData,password:hashedPassword})
      if(!user){
        errorCreator("User Signup Failed",401)
      }
      res.status(201).send(responseCreator("User Signed Up Successfully !",user))
      
  } catch (error) {
    next(error)
  }
};

const loginController = async (req, res, next) => {
  try {
    const userData = req.body;
    const {username,password} = userData;
    const user = await UserModel.findUser(username);
    const {password:hashedPassword} = user;
    const isPasswordSame = await verifyPassword(password,hashedPassword);
    if(!isPasswordSame){
      errorCreator("Invalid Credentials",402)
    }
    res.status(200).send(responseCreator("User LoggedIn Successfully !",user))
  } catch (error) {
    next(error)
  }
};

module.exports = { loginController, signupController };
