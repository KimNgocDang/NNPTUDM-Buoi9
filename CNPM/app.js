const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const connectDB = require("./utils/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product.route");
const inventoryRouter = require("./routes/inventory.route");
const messageRoutes = require("./routes/message.routes");
const authMiddleware = require("./middlewares/auth");
const app = express();
connectDB();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/message", authMiddleware, messageRoutes);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/inventories", inventoryRouter);

app.use("/message", messageRoutes);


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    error: err.message
  }); 
});

module.exports = app;