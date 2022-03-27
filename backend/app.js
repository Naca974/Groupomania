//  Create server from framework Express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Security mods
const cors = require("cors");
const helmet = require("helmet");
const expressSanitizer = require("express-sanitizer");
const nocache = require("nocache");
const hpp = require("hpp");
const session = require("express-session");
require("dotenv").config({ path: process.cwd() + "/.env" });

// Router
const userRouter = require("./routes/rteUsers");
const postRouter = require("./routes/rtePosts");
const likeRouter = require("./routes/rteLike");
const commentRouter = require("./routes/rteComments");

// Launch Express framework
const app = express();

// Middleware CORS add header to object "response"/*
app.use(cors());

// Secure Express with different headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Protect against injections
app.use(expressSanitizer());

// Disable cache
app.use(nocache());

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Secure cookies
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
app.use(
  session({
    name: process.env.sessName,
    secret: process.env.sessSecret,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000",
      expires: expiryDate,
    },
  })
);

// BodyParser extract the object JSON from request
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Make images file static
app.use("/images", express.static(path.join(__dirname, "images")));

// Save the routes in the app
app.use('/user',userRouter);
app.use('/post',postRouter);
app.use(likeRouter);
app.use('/comment',commentRouter);

module.exports = app;
