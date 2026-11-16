const express = require("express");
const weatherController = require("../controllers/weatherController");

const weatherRouter = express.Router();

weatherRouter.get("/weather", weatherController.getWeather);

module.exports = weatherRouter;