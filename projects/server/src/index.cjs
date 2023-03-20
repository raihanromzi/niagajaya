"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const port = +(process.env.PORT || 8000);
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const routes = require("./routes/index.cjs");
app.use("/auth", routes.authRoute);
app.use("/address", routes.addressRoute);
app.use("/api", routes.adminAuthRoute);
app.use("/api", routes.userRoute);

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`);
});
