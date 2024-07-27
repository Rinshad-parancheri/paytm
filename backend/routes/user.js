const { Router } = require("express")
const { validateSignUpInput, validateSignInInput } = require("../middleware/inputValidation")
const { User, Account } = require("../db/db")
const userRouter = Router()
const { verifyJwtToken } = require("../middleware/jwtAuth")
const z = require("zod")
const { signUp, signIn } = require("../controllers/user.controller")



userRouter.post("/signup", validateSignUpInput, signUp)
userRouter.post("signin", validateSignInInput, signIn)

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
