const UserModel = require("../models/UserModel");

const addToCartController = async(req,res,next)=>{
  const {username} = res.locals.user;
  const addToCart = await UserModel.add
}