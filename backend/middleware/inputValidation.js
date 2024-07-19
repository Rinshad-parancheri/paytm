const z = require("zod");

const userSchema = z.object({
  firstName: z.string().min(4),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(5)
});

const validateInput = (req, res, next) => {
  try {
    let payload = userSchema.safeParse(req.body);

    if (!payload.success) {
      res.status(404).json({
        err: "invalid input"
      })
      return
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = { validateInput };
