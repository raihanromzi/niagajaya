"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { default: RedisStore } = require("connect-redis");
const redis = require("./utils/redis.cjs");
const auth_routes = require("./routes/auth.cjs");

const port = process.env.PORT || 8000;
const app = express();
const redisStore = new RedisStore({
  client: redis,
  disableTouch: true,
});

// app.set("trust proxy", 1)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 31536000000, // 365 days
      httpOnly: true,
      sameSite: "lax",
      secure: "auto",
    },
  })
);
app.use("/api/v1/auth", auth_routes);

app.listen(+port, () => {
  console.log(`APP RUNNING at ${port} ✅`);
});
