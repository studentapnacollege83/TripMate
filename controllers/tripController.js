
const Trip = require("../models/Trip");

// My Trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      createdBy: req.session.user.id
    }).sort({ createdAt: -1 });

    res.render("trips/index", { trips });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).send("Something went wrong.");
  }
};


// New Trip Page
exports.getNewTrip = (req, res) => {
  res.render("trips/new");
};


// Create Trip
exports.postTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      budget,
      notes
    } = req.body;

    await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      budget: budget || 0,
      notes,
      createdBy: req.session.user.id
    });

    res.redirect("/trips");
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).send("Could not create trip.");
  }
};


// Trip Details
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    res.render("trips/show", { trip });
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).send("Something went wrong.");
  }
};


// Edit Trip Page
exports.getEditTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    res.render("trips/edit", { trip });
  } catch (error) {
    console.error("Edit trip page error:", error);
    res.status(500).send("Something went wrong.");
  }
};


// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      budget,
      notes
    } = req.body;

    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.session.user.id
      },
      {
        title,
        destination,
        startDate,
        endDate,
        budget: budget || 0,
        notes
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    res.redirect(`/trips/${trip._id}`);
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).send("Could not update trip.");
  }
};


// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    res.redirect("/trips");
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).send("Could not delete trip.");
  }
};


// Add Itinerary Item
exports.addItineraryItem = async (req, res) => {
  try {
    const {
      day,
      time,
      activity,
      location,
      notes
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    trip.itinerary.push({
      day: Number(day),
      time,
      activity,
      location,
      notes
    });

    await trip.save();

    res.redirect(`/trips/${trip._id}`);
  } catch (error) {
    console.error("Add itinerary error:", error);
    res.status(500).send("Could not add itinerary item.");
  }
};


// Delete Itinerary Item
exports.deleteItineraryItem = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    trip.itinerary = trip.itinerary.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await trip.save();

    res.redirect(`/trips/${trip._id}`);
  } catch (error) {
    console.error("Delete itinerary error:", error);
    res.status(500).send("Could not delete itinerary item.");
  }
};


// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const {
      category,
      amount,
      description,
      date
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    trip.expenses.push({
      category,
      amount: Number(amount),
      description,
      date: date || Date.now()
    });

    await trip.save();

    res.redirect(`/trips/${trip._id}`);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).send("Could not add expense.");
  }
};


// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.session.user.id
    });

    if (!trip) {
      return res.status(404).render("error", {
        message: "Trip not found."
      });
    }

    trip.expenses = trip.expenses.filter(
      (expense) => expense._id.toString() !== req.params.expenseId
    );

    await trip.save();

    res.redirect(`/trips/${trip._id}`);
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).send("Could not delete expense.");
  }
};
