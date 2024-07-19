const jwt = require("jsonwebtoken")
require('dotenv').config();

const verifyJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403).json({
      msg: "auth failed"

    })
    return
  }


  const token = authHeader.split(" ")[1];
  const key = process.env.JWT_SECRET
  try {

    const user = jwt.verify(token, key)
    if (user.userId) {
      req.id = user.userId
    }
    next()
  } catch (e) {
    res.status(403).json({ msg: "jwt auth failed" })
  }

}


module.exports = {
  verifyJwtToken
}
