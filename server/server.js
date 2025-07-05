const express = require("express")
require("dotenv").config()
const errorHandler = require("./utils/errorHandler")
require("./utils/dbConnection")
const cartRouter = require("./routers/cartRouter")
const userRouter = require("./routers/userRouter")

const app = express()

app.use(express.json())

app.use("/user",userRouter)
// app.use("/cart",cartRouter)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT||4000,()=>{
  console.clear()
  console.log(`Server Listening on ${PORT}`);

})