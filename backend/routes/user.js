const { Router } = require("express")
const { validateSignUpInput, validateSignInInput } = require("../middleware/inputValidation")
const { User, Account } = require("../db/db")
const { verifyJwtToken } = require("../middleware/jwtAuth")
const z = require("zod")
const { signUp, signIn, update, updateInBulk } = require("../controllers/user.controller")

const userRouter = Router()


userRouter.post("/signup", validateSignUpInput, signUp)
userRouter.post("signin", validateSignInInput, signIn)
userRouter.put("/update", verifyJwtToken, update)
userRouter.put("/update/bulk", verifyJwtToken, updateInBulk)


module.exports = {
  userRouter
}
