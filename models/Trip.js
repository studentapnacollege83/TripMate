
const mongoose = require("mongoose");

// Itinerary Item Schema
const itineraryItemSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1
    },

    time: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true
    },

    activity: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    _id: true
  }
);


// Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Stay",
        "Food",
        "Transport",
        "Activities",
        "Shopping",
        "Other"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: true
  }
);


// Trip Schema
const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    budget: {
      type: Number,
      default: 0,
      min: 0
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    itinerary: {
      type: [itineraryItemSchema],
      default: []
    },

    expenses: {
      type: [expenseSchema],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
