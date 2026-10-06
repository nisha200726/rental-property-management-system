const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "House",
        "Apartment",
        "Room",
        "Villa",
        "Commercial"
      ],
      required: true
    },

    rent: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Rented"
      ],
      default: "Available"
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

module.exports = Property;