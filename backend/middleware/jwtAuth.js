const jwt = require("jsonwebtoken")

const verifyJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader.startsWith("Bearer")) {
    res.status(403).json({

    })

  }


  const token = authHeader.split(" ")[1];

  const key = process.env.JWT_SCERET
  try {
    const user = jwt.verify(authHeader, key)
    if (user._id) {
      req.id = user._id
    }
    next()

  } catch (e) {
    res.status(403).json({})
  }

}


module.exports = {
  verifyJwtToken
}
