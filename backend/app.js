require("dotenv").config();
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { registerUser, loginUser } = require("./controllers/users.controller.js");
const { verifyToken, isAdmin, checkUserOwnership } = require("./middlewares/auth.middleware");
const { validateRegister, validateLogin } = require("./middlewares/validate.middleware");
const ticketsRouter = require("./routes/ticket.routes.js")
const propertiesRouter = require("./routes/property.routes.js")
const usersRouter = require("./routes/user.routes.js")

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/api/tickets", ticketsRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/users", usersRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT || 3000, () =>
      console.log(`API en http://localhost:${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB:", err.message);
    process.exit(1);
  });