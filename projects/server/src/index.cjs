require("dotenv/config");
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis").default;
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const auth_routes = require("./routes/auth.cjs");

const port = process.env.PORT || 8000;
const app = express();
const redis = new Redis(process.env.REDIS_URL);
const redisStore = new RedisStore({
  client: redis,
  prefix: "myapp:",
  disableTouch: true,
});

// app.set("trust proxy", 1)
app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(","),
    ],
    credentials: true,
  })
);
app.use(express.json());
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

app.listen(+port, (err) => {
  if (err) {
    console.error(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${port} ✅`);
  }
});
