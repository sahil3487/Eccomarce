const app = require("./app")
//const route = require("./routes/productRoutes");
const mongoose = require("mongoose")
const dotenv =require("dotenv")

//config
dotenv.config({path:"backend/config/config.env"})


// handling uncought exception

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncought Exception`)
    process.exit(1)


})






// mongodb connection

mongoose
    .connect(
        "mongodb://localhost:27017",
        {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("MongoDb is Connected "))
    .catch((err) => console.log(err.message));


// unhandle.promise.rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandle promise rejection`)

    server.close(() => {
        process.exit(1)
    })
})
// server port

const server = app.listen(process.env.PORT || 4000, function () {
    console.log("Sahil your Express app is running on port " + (process.env.PORT || 4000));
});