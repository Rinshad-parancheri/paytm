const { Router, json } = require("express")
const { validateInput } = require("../middleware/inputValidation")
const { User, Account } = require("../db/db")
const userRouter = Router()
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { verifyJwtToken } = require("../middleware/jwtAuth")
const z = require("zod")



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
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    res.status(200).json({
      msg: "user Exit with same email"
    })
    return
  }
  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })


  if (user) {
    Account.create({
      userId: user._id,
      balance: Math.random() * 1000
    })
  }

  if (user._id) {
    res.status(201).json({
      msg: 'account created successfully'
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


  const jwtKey = process.env.JWT_SECRET

  if (!jwtKey) {
    console.log("jwtKeyproblem")
  }

  let userId = existingUser._id


  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    msg: "sign in successfully here is your token",
    token
  })

  return

})

const updateSchema = z.object({
  firstName: z.string().optional(),
  secondName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8)
})

userRouter.put("/update", verifyJwtToken, async (req, res) => {
  try {
    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: result.error.errors
      });
    }

    const updateData = result.data;

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: "An error occurred while updating the user"
    });
  }
});

userRouter.get("/bulk", verifyJwtToken, async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Use query parameters for GET requests

    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } }
      ]
    });

    res.json({
      users: users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id
      }))
    });
  } catch (error) {
    console.error('Bulk user fetch error:', error);
    res.status(500).json({
      error: "An error occurred while fetching users"
    });
  }
});
module.exports = {
  userRouter
}
