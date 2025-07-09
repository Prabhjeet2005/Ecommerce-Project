const { errorCreator } = require("../utils/responseHandler")

const isAdminMiddleware = async(req,res,next)=>{
  try {
    const {role} = res.locals.user
    if(role !== "admin"){
      errorCreator("Protected Route",401)
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = isAdminMiddleware