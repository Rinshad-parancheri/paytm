const { Router } = require("express");
const { verifyJwtToken } = require("../middleware/jwtAuth");
const { Account, User } = require("../db/db");
const accountRouter = Router()
const z = require("zod")
const mongoose = require("mongoose")

accountRouter.get("/balance", verifyJwtToken, async (req, res) => {

  let userBalance = await Account.findOne({ userId: req.id })

  res.status(200).json({
    balance: userBalance
  })
})

let transferSchema = z.object({
  to: z.string(),
  amount: z.number()
})

accountRouter.post("/transfer", verifyJwtToken, async (req, res) => {

  let data = transferSchema.safeParse(req.body)
  if (!data.success) {
    res.status(404).json({
      msg: "invalid input"
    })
  }

  let { amountToSend, idToTransfer } = req.body

  let session = await mongoose.startSession()
  session.startTransaction()



  let account = Account.findOne({
    userId: idToTransfer
  }).session(session)


  if (!account || account.balance < amountToSend) {
    session.abortTransaction()
    res.status(404).json({
      msg: 'invalid account '
    })
  }


  let userToTransfer = Account.findOne({
    userId: idToTransfer
  })

  if (!userToTransfer) {
    session.abortTransaction()
    res.status(404).json({
      msg: "user doesn't exist"
    })
  }

  await Account.updateOne({ userId: req.id }, { $inc: { balance: -amountToSend } }).session(session)
  await Account.updateOne({ userId: req.id }, { $inc: { balance: amountToSend } }).session(session)

  await session.commitTransaction()

  res.status(200).json({
    msg: "money tranfered suscfully"
  })
})

module.exports = {
  accountRouter
}

