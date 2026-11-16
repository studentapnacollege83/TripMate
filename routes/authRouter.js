const express = require("express");
const authController = require("../controllers/authController");
const { isGuest } = require("../middleware/guestMiddleware");

const authRouter = express.Router();

authRouter.get("/register", isGuest, authController.getRegister);
authRouter.post("/register", isGuest, authController.postRegister);

authRouter.get("/login", isGuest, authController.getLogin);
authRouter.post("/login", isGuest, authController.postLogin);

authRouter.post("/logout", authController.logout);

module.exports = authRouter;