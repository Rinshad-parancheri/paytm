const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: [true, "id is required"]
  },
  balance: {
    type: Number,
    require: [true, "balance is required"]
  }
})





const Account = mongoose.model("Account", accountSchema)

module.exports = {

  Account
}
