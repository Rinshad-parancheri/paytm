const express = require("express")
const { mainRouter } = require("./routes")

require('dotenv').config();

const app = express()
app.use(express.json())


app.use("/app/v1", mainRouter)



app.listen(3000)
