const express = require("express")
const { mainRouter } = require("./routes")
const cors = require("cors");
const connectDB = require("./db/db");
require('dotenv').config();

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173'
};


app.use(cors(corsOptions))
app.use(express.json())
app.use("/app/v1", mainRouter)


const startServer = async () => {

  try {
    await connectDB()
    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`server is running on the Port${PORT}`)
    })

  } catch (e) {
    console.log(`failed to connect to database:`, e)
    process.exit()
  }

}

startServer()


