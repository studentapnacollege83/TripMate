const express = require("express");
const tripController = require("../controllers/tripController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const tripRouter = express.Router();

tripRouter.get(
  "/trips",
  isAuthenticated,
  tripController.getTrips
);

tripRouter.get(
  "/trips/new",
  isAuthenticated,
  tripController.getNewTrip
);

tripRouter.post(
  "/trips",
  isAuthenticated,
  tripController.postTrip
);

tripRouter.get(
  "/trips/:id",
  isAuthenticated,
  tripController.getTrip
);

tripRouter.get(
  "/trips/:id/edit",
  isAuthenticated,
  tripController.getEditTrip
);

tripRouter.post(
  "/trips/:id/edit",
  isAuthenticated,
  tripController.updateTrip
);

tripRouter.post(
  "/trips/:id/delete",
  isAuthenticated,
  tripController.deleteTrip
);
// Add Itinerary Item
tripRouter.post(
  "/trips/:id/itinerary",
  isAuthenticated,
  tripController.addItineraryItem
);

// Delete Itinerary Item
tripRouter.post(
  "/trips/:id/itinerary/:itemId/delete",
  isAuthenticated,
  tripController.deleteItineraryItem
);
// Add Expense
tripRouter.post(
  "/trips/:id/expenses",
  isAuthenticated,
  tripController.addExpense
);

// Delete Expense
tripRouter.post(
  "/trips/:id/expenses/:expenseId/delete",
  isAuthenticated,
  tripController.deleteExpense
);
module.exports = tripRouter;