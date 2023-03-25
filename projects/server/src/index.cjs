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
app.use(
  session({
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public", { index: false }));

const routes = require("./routes/index.cjs");
app.use("/auth", routes.authRoute);
app.use("/address", routes.addressRoute);
app.use("/warehouses", routes.warehousesRoute);
app.use("/products", routes.productRoute);
app.use("/categories", routes.categoryRoute);

// Admin
app.use("/api", routes.adminAuthRoute);
app.use("/api", routes.userRoute);

const authRoutes = require("./routes/auth.cjs");
const usersRoutes = require("./routes/users.cjs");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/products", routes.productRoute);
app.use("/categories", routes.categoryRoute);

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`);
});
