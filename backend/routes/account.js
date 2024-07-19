const { Router } = require("express");
const { verifyJwtToken } = require("../middleware/jwtAuth");
const { Account, User } = require("../db/db");
const accountRouter = Router()
const z = require("zod")
const mongoose = require("mongoose")

accountRouter.get("/balance", verifyJwtToken, async (req, res) => {
  console.log("hello")
  let userBalance = await Account.findOne({ userId: req.id })
  res.status(200).json({
    msg: "your balance",
    balance: userBalance.balance
  })
})

let transferSchema = z.object({
  idToTransfer: z.string(),
  amountToSend: z.string()
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


  let senderAc = Account.findOne({
    userId: req.id
  }).session(session)

  if (!senderAc || senderAc.balance < amountToSend) {
    session.abortTransaction()
    res.status(404).json({
      msg: 'invalid account '
    })
  }

  let receiverAc = Account.findOne({
    userId: idToTransfer
  }).session(session)


  if (!receiverAc) {
    session.abortTransaction()
    res.status(404).json({
      msg: "user doesn't exist"
    })
  }
  await Account.updateOne({ userId: req.id }, { $inc: { balance: -amountToSend } }).session(session)
  await Account.updateOne({ userId: idToTransfer }, { $inc: { balance: amountToSend } }).session(session)

  await session.commitTransaction()

  res.status(200).json({
    msg: "money tranfered suscfully"
  })
})

module.exports = {
  accountRouter
}

