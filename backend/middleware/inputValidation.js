const z = require("zod");

const signUpSchema = z.object({
  firstName: z.string().min(4),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(5)
});


let siginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
})

const updateSchema = z.object({
  firstName: z.string().optional(),
  secondName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8)
})

const transferInpuSchema = z.object({
  idToTransfer: z.string(),
  amountToTransfer: z.string()
})


const validateSignInInput = (req, res, next) => {
  const payload = siginSchema.safeParse(req.body);
  console.log(`hello from the payload${payload}`)
  if (payload.success) {
    req.body = payload.data;
    next();
  } else {
    res.status(400).json({
      err: "Invalid input",
      details: payload.error.errors
    });
  }
};


const validateSignUpInput = async (req, res, next) => {
  const payload = signUpSchema.safeParse(req.body)
  if (payload.success) {
    req.body = payload.data;
    next();
  } else {
    res.status(400).json({
      err: "Invalid input",
      details: payload.error.errors
    });
  }
}



module.exports = {
  validateSignInInput,
  validateSignUpInput,
  updateSchema,
  transferInpuSchema
}

