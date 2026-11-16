const express = require("express");
const placesController = require("../controllers/placesController");

const placesRouter = express.Router();

placesRouter.get("/places", placesController.searchPlaces);

placesRouter.get("/places/:xid", placesController.showPlace);

module.exports = placesRouter;