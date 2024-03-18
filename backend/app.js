// Requirements
const createError = require('http-errors');
const express = require('express');
const indexRouter = require("./routers/index");
const usersRouter = require("./routers/users");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require('mongoose');
const { Task } = require("./mongo/schema");


// Create express app
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Start server + error handling
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.send("error");
});

const port = 3001;
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


// Connect to MongoDB
mongoose.connect("mongodb+srv://<username>:<password>@todolist.m2jpear.mongodb.net/");


// Functions
mongoose.connection
.once("open", function () {
    console.log("MongoDB connection created");
})
.on("error", function (error) {
    console.log("Error connecting to MongoDB: " + error);
})


// Close connection and server on Ctrl + C
process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Closing connection and exiting...');
    
    mongoose.connection.close().then(() => {
        console.log('MongoDB connection closed');
        server.close(() => {
            console.log('Express server closed');
            process.exit(0);
        });
    }).catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    });
});