const mongoose = require("mongoose")

require('dotenv').config();

mongoose.connect(process.env.DB_URL)
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Password must be at least 8 characters long']
  },
})

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



const User = mongoose.model("User", userSchema)

const Account = mongoose.model("Account", accountSchema)

module.exports = {
  User,
  Account
}
