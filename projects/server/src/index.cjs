"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { default: RedisStore } = require("connect-redis");
const redis = require("./utils/redis.cjs");

const port = +(process.env.PORT || 8000);
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
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY_SESSION,
    cookie: {
      maxAge: 31536000000, // 365 days
      httpOnly: true,
      sameSite: "lax",
      secure: "auto",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes/index.cjs");
app.use("/auth", routes.authRoute);
app.use("/address", routes.addressRoute);
app.use("/products", routes.productRoute);
app.use("/categories", routes.categoryRoute);

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`);
});
