const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    rentAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Active",
        "Completed",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Rental = mongoose.model(
  "Rental",
  rentalSchema
);

module.exports = Rental;