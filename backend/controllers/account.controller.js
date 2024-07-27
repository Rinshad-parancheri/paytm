const mongoose = require('mongoose');
const { Account } = require('../models/account');
const { transferSchema } = require('../middleware/inputValidation');

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const getBalance = async (req, res) => {
  try {
    const userAccount = await Account.findOne({ userId: req.user.id });
    if (!userAccount) {
      return res.status(STATUS.NOT_FOUND).json({
        msg: "Account not found"
      });
    }
    return res.status(STATUS.OK).json({
      msg: "Your balance",
      balance: userAccount.balance
    });
  } catch (error) {
    console.error('Error in getBalance:', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error"
    });
  }
};

const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = transferSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(STATUS.BAD_REQUEST).json({
        msg: "Invalid input",
        errors: data.error.errors
      });
    }

    const { amountToSend, idToTransfer } = data.data;

    const senderAccount = await Account.findOne({ userId: req.user.id }).session(session);
    if (!senderAccount || senderAccount.balance < amountToSend) {
      await session.abortTransaction();
      return res.status(STATUS.BAD_REQUEST).json({
        msg: 'Insufficient funds or invalid account'
      });
    }

    const receiverAccount = await Account.findOne({ userId: idToTransfer }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      return res.status(STATUS.NOT_FOUND).json({
        msg: "Recipient account doesn't exist"
      });
    }

    await Account.updateOne(
      { userId: req.user.id },
      { $inc: { balance: -amountToSend } }
    ).session(session);

    await Account.updateOne(
      { userId: idToTransfer },
      { $inc: { balance: amountToSend } }
    ).session(session);

    await session.commitTransaction();
    return res.status(STATUS.OK).json({
      msg: "Money transferred successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in transfer:', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error"
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getBalance,
  transfer
};
