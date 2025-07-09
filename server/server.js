const express = require("express")
require("dotenv").config()
const errorHandler = require("./utils/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("./utils/dbConnection")
const cartRouter = require("./routers/cartRouter")
const userRouter = require("./routers/userRouter")
const productRouter = require("./routers/productRouter")

const app = express()

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json())
app.use(cookieParser())

app.use("/user",userRouter)
app.use("/cart",cartRouter)
app.use("/product",productRouter)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT||4000,()=>{
  console.clear()
  console.log(`Server Listening on ${PORT}`);

})