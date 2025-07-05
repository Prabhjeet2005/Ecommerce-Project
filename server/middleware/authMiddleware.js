const UserModel = require("../models/UserModel");
const { verifyToken } = require("../utils/jwtUtil")

const authMiddleware = async(req,res,next)=>{
  try {
    const {authToken} = req.cookies
    const data = verifyToken(authToken)
    const {username} = data;
    const {password,...user} = await UserModel.findUser(username)
    res.locals.user = user;
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware