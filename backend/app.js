const express = require("express");
const  errorMiddlewar = require("./Middleware/Error")
const cookieparser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieparser())




// route imports

const product = require("./routes/productRoutes")
const user = require("./routes/User Routes")
const order = require("./routes/orderRoute")
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

// middleware for error
app.use(errorMiddlewar)

module.exports =app