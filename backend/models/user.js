
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


const User = mongoose.model("User", userSchema)

module.exports = {
  User
}
