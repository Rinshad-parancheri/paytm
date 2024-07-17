const { Router } = require("express")
const { validateInput } = require("../middleware/inputValidation")
const { User } = require("../db/db")
const userRouter = Router()
const crypto = require("crypto")
const jwt = require("jsonwebtoken")






const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};


userRouter.post("/signup", validateInput, async (req, res) => {
  const body = req.body

  const existingUser = await User.findOne({ email: body.email })

  if (existingUser._id) {
    res.status(200).json({
      msg: "user Exit with same email"
    })
  }
  const hashedPassword = await hashPassword(body.password)

  const user = await User.create({
    body.firstName,
    body.secondName,
    body.email,
    hashedPassword
  })


  console.log(user)

  if (user._id) {
    res.status(201).json({
      id: user._id
    })
  } else {
    res.status(400).josn({
      msg: "server down "
    })

  }
})

const verifyHashedPassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
};



userRouter.post("/signin", validateInput, async (req, res) => {
  const body = req.body

  const existingUser = await User.findOne({ email: body.email })

  if (!existingUser) {
    res.status(404).json({
      msg: `invalid credential`
    })

    return
  }

  const hashedPassword = existingUser.password

  const validatedPassword = await verifyHashedPassword(body.password, hashedPassword)

  if (!validatedPassword) {
    res.status(401).json({
      msg: "Authentication failed"
    })
    return
  }

  const userId = existingUser._id

  const jwtKey = process.env.JWT_SECRET
  if (!jwtKey) {
    console.log("jwtKeyproblem")
  }
  let payload = existingUser
  const jwtToken = jwt.sign({
    payload
  }, jwtKey)

  res.status(200).json({
    token: jwtToken
  })

  return

})

userRouter.
  module.exports = {
  userRouter
}
