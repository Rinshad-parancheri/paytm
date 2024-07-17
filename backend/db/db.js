const mongoose = require("mongoose")

const dbUrl = process.env.DB_URL

mongoose.connect(url)
const userSchema = new mongoose.Schema({

})



const User = mongoose.model("User", userSchema)



module.exports = {
  User
}
