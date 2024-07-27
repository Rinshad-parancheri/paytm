const { Router } = require("express");
const { verifyJwtToken } = require("../middleware/jwtAuth");
const { transfer, getBalance } = require("../controllers/account.controller");

const accountRouter = Router()

accountRouter.get("/balance", verifyJwtToken, getBalance)
accountRouter.post("transfer", verifyJwtToken, transfer)

verifyJwtToken, module.exports = {
  accountRouter
}

