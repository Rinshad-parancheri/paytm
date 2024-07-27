const { Account } = require("../models/account");
const { User } = require("../models/user");
const { hashPassword } = require("../util/haspassword");
const { verifyHashedPassword } = require("../util/verifyHashedPassword");
const { updateSchema, signUpSchema, signInSchema } = require("../middleware/inputValidation");
const jwt = require('jsonwebtoken');

const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error finding user by email: ", error);
    throw new Error('Internal server error');
  }
};

const signUp = async (req, res) => {

  const { firstName, lastName, email, password } = req.body

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    console.log("existingUser")
    return res.status(STATUS.CONFLICT).json({ msg: "User exists with same email" });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });

  await Account.create({ userId: user._id, balance: Math.round(Math.random() * 200) });
  return res.status(STATUS.CREATED).json({ msg: 'Account created successfully' });

};



const signIn = async (req, res) => {
  try {
    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(STATUS.BAD_REQUEST).json({
        error: "Invalid input",
        details: result.error.errors
      });
    }

    const { email, password } = result.data;

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(STATUS.UNAUTHORIZED).json({ msg: "Authentication failed" });
    }

    const validPassword = await verifyHashedPassword(password, existingUser.password);
    if (!validPassword) {
      return res.status(STATUS.UNAUTHORIZED).json({ msg: "Authentication failed" });
    }

    const jwtKey = process.env.JWT_SECRET;
    if (!jwtKey) {
      console.error("JWT_SECRET not set");
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }

    const token = jwt.sign({ userId: existingUser._id }, jwtKey, { expiresIn: '1h' });
    return res.status(STATUS.OK).json({
      msg: "Sign in successful",
      token
    });
  } catch (error) {
    console.error("Error in signIn: ", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(STATUS.BAD_REQUEST).json({
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
      return res.status(STATUS.NOT_FOUND).json({ error: "User not found" });
    }

    return res.status(STATUS.OK).json({
      message: "User updated successfully",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while updating the user"
    });
  }
}
const updateInBulk = async (req, res) => {
  try {
    const filter = req.query.filter || "";
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
};


module.exports = {
  signUp,
  signIn,
  update,
  updateInBulk
};
