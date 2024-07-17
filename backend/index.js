const express = require("express")
const { mainRouter } = require("./routes")

require('dotenv').config();

app.use(express.json())
const app = express()


app.use("/app/v1", mainRouter)



app.listen(3000)
