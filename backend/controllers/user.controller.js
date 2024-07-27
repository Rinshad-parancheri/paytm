const { Account } = require("../models/account");
const { User } = require("../models/user");
const { hashPassword } = require("../util/haspassword");


const { Account } = require("../models/account");
const { User } = require("../models/user");
const { hashPassword } = require("../util/haspassword");
const { verifyHashedPassword } = require("../util/verifyHashedPassword");


const findExistingUser = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error finding user by email: ", error);
    throw new Error('Internal server error');
  }


}; const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await userFindByEmail(email);
    if (existingUser) {
      return res.status(409).json({ msg: "User exists with same email" });
    }
  } catch (error) {
    console.log("Error checking existing user: " + error);
    return res.status(500).json({ msg: "Internal server error" });
  }

  let hashedPassword;
  try {
    hashedPassword = await hashPassword(password);
  } catch (error) {
    console.log("Error hashing password: " + error);
    return res.status(500).json({ msg: "Internal server error" });
  }



  try {
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    if (user) {

      //create dummy account with random money

      await Account.create({ userId: user._id, balance: Math.round(Math.random() * 2 * 100) });
      return res.status(201).json({ msg: 'Account created successfully' });
    } else {
      return res.status(500).json({ msg: "Internal server error" });
    }
  } catch (error) {
    console.log("Error creating user: " + error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};



const signIn = async (req, res) => {
  let existingUser
  const { email, password } = req.body

  try {
    existingUser = await userFindByEmail(email);
    if (existingUser) {
      return res.status(409).json({ msg: "User exists with same email" });
    }
  } catch (error) {
    console.log("Error checking existing user: " + error);
    return res.status(500).json({ msg: "Internal server error" });
  }
  try {
    const hashedPassword = existingUser.password

    const validatedPassword = await verifyHashedPassword(password, hashedPassword)

    if (validatedPassword) {
      return res.status(401).json({
        msg: "Authentication failed"
      })
    }


  } catch (e) {
    res.status(409).json({
      msg: `internal problem ${e.error}`
    })
  }


  try {
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

  } catch (e) {

    res.status(404).json({
      msg: `user creation failed ${e.error}`
    })
  }
}

module.exports = {
  signUp,
  signIn,
  // update,
  // bulkUpdate
}
