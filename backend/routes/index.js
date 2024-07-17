const { Router } = require("express")
const { userRouter } = require("./user")


const mainRouter = Router()

mainRouter.use("/user", userRouter)




module.exports = {
  mainRouter
}
