require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connection = require("./config/db");
const mongoose = require("mongoose");
const routes = require("./routes");
var cookieParser = require('cookie-parser')
var corsOptionsDelegate = require("./utils/initCors");

// database connection
connection();

// middlewares
app.use(cookieParser())
app.use(express.json());
app.use(cors(corsOptionsDelegate));

// base page
app.get("/", (request, response) =>
    response.sendFile(path.join(__dirname, "public", "index.html"))
);

// routes
app.use(routes)

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    const gracefulShutdown = async () => {
       
        mongoose.connection.close();
        console.info("MongoDB disconnected");
        console.info("Graceful shutdown");
        process.exit(0);
      };
  
      [
        "beforeExit",
        "uncaughtException",
        "unhandledRejection",
        "SIGHUP",
        "SIGINT",
        "SIGQUIT",
        "SIGILL",
        "SIGTRAP",
        "SIGABRT",
        "SIGBUS",
        "SIGFPE",
        "SIGUSR1",
        "SIGSEGV",
        "SIGUSR2",
        "SIGTERM",
      ].forEach((evt) => {
        process.on(evt, console.log)
        process.on(evt, gracefulShutdown);
      });
});