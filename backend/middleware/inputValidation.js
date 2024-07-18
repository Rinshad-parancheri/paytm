const z = require("zod");

const userSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  email: z.string().email(),
  password: z.string().min(8)
});

const validateInput = (req, res, next) => {
  try {
    userSchema.parse(req.body);

    if (!userSchema.success) {
      res.status(404).json({
        err: "invalid input"
      })
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = { validateInput };
