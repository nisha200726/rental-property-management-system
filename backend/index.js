const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Property = require("./models/Property");
const Rental = require("./models/Rental");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/rentaldb")
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((error) => {
    console.log("Database Connection Error:");
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rental Property Management System Backend is running"
  });
});

app.post("/register", (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const normalizedRole = String(role).trim().toLowerCase();

  if (normalizedRole !== "owner" && normalizedRole !== "customer") {
    return res.status(400).json({
      success: false,
      message: "Role must be owner or customer"
    });
  }

  const emailValue = String(email).trim().toLowerCase();

  User.findOne({ email: emailValue })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({
        name: String(name).trim(),
        email: emailValue,
        password: hashedPassword,
        phone: String(phone).trim(),
        role: normalizedRole
      });

      return newUser.save();
    })
    .then((savedUser) => {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          role: savedUser.role
        }
      });
    })
    .catch((error) => {
      console.log("Registration Error:");
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    });
});

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password and role are required"
    });
  }

  const normalizedRole = String(role).trim().toLowerCase();

  if (normalizedRole !== "owner" && normalizedRole !== "customer") {
    return res.status(400).json({
      success: false,
      message: "Role must be owner or customer"
    });
  }

  const emailValue = String(email).trim().toLowerCase();

  User.findOne({ email: emailValue, role: normalizedRole })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    })
    .catch((error) => {
      console.log("Login Error:");
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    });
});

app.post("/properties", async (req, res) => {
  try {
    const { title, description, location, type, rent, ownerId } = req.body;

    if (!title || !description || !location || !type || rent === undefined || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "All property fields are required"
      });
    }

    if (Number(rent) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Rent must be greater than 0"
      });
    }

    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    if (owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can add properties"
      });
    }

    const newProperty = new Property({
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      type: String(type).trim(),
      rent: Number(rent),
      status: "Available",
      ownerId: ownerId
    });

    await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: newProperty
    });
  } catch (error) {
    console.log("Add Property Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/properties", async (req, res) => {
  try {
    const { location, type, maxRent } = req.query;
    const filter = {};

    if (location) {
      filter.location = { $regex: String(location).trim(), $options: "i" };
    }

    if (type) {
      filter.type = String(type).trim();
    }

    if (maxRent) {
      const maximumRent = Number(maxRent);
      if (Number.isNaN(maximumRent) || maximumRent <= 0) {
        return res.status(400).json({
          success: false,
          message: "maxRent must be a valid number greater than 0"
        });
      }
      filter.rent = { $lte: maximumRent };
    }

    const properties = await Property.find(filter)
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties: properties
    });
  } catch (error) {
    console.log("Search Properties Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/properties/owner/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    if (owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "This user is not an owner"
      });
    }

    const properties = await Property.find({ ownerId: ownerId }).populate("ownerId", "name email phone");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties: properties
    });
  } catch (error) {
    console.log("Get Owner Properties Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("ownerId", "name email phone");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      property: property
    });
  } catch (error) {
    console.log("Get Single Property Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.put("/properties/:id", async (req, res) => {
  try {
    const { title, description, location, type, rent, ownerId } = req.body;

    if (!title || !description || !location || !type || rent === undefined || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "All property fields are required"
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    if (property.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own properties"
      });
    }

    property.title = String(title).trim();
    property.description = String(description).trim();
    property.location = String(location).trim();
    property.type = String(type).trim();
    property.rent = Number(rent);

    await property.save();

    const updatedProperty = await Property.findById(req.params.id).populate("ownerId", "name email phone");

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty
    });
  } catch (error) {
    console.log("Update Property Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.delete("/properties/:id", async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner ID is required"
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    if (property.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own properties"
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    console.log("Delete Property Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.post("/rentals", async (req, res) => {
  try {
    const { propertyId, customerId, startDate, endDate } = req.body;

    if (!propertyId || !customerId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Property ID, customer ID, start date and end date are required"
      });
    }

    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    if (customer.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "This user is not a customer"
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    if (property.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Property is already rented"
      });
    }

    const rentalStartDate = new Date(startDate);
    const rentalEndDate = new Date(endDate);

    if (Number.isNaN(rentalStartDate.getTime()) || Number.isNaN(rentalEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid rental dates"
      });
    }

    if (rentalEndDate <= rentalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    const newRental = new Rental({
      propertyId: propertyId,
      customerId: customerId,
      startDate: rentalStartDate,
      endDate: rentalEndDate,
      rentAmount: property.rent,
      status: "Active"
    });

    await newRental.save();

    property.status = "Rented";
    await property.save();

    const rental = await Rental.findById(newRental._id).populate("propertyId").populate("customerId", "name email phone");

    res.status(201).json({
      success: true,
      message: "Property rented successfully",
      rental: rental
    });
  } catch (error) {
    console.log("Create Rental Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/rentals", async (req, res) => {
  try {
    const rentals = await Rental.find().populate("propertyId").populate("customerId", "name email phone");

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals: rentals
    });
  } catch (error) {
    console.log("Get Rentals Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/rentals/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    if (customer.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "This user is not a customer"
      });
    }

    const rentals = await Rental.find({ customerId: customerId }).populate("propertyId").populate("customerId", "name email phone");

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals: rentals
    });
  } catch (error) {
    console.log("Get Customer Rentals Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/rentals/owner/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    if (owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "This user is not an owner"
      });
    }

    const ownerProperties = await Property.find({ ownerId: ownerId }).select("_id");
    const propertyIds = ownerProperties.map((property) => property._id);

    const rentals = await Rental.find({ propertyId: { $in: propertyIds } })
      .populate("propertyId")
      .populate("customerId", "name email phone");

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals: rentals
    });
  } catch (error) {
    console.log("Get Owner Rentals Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.put("/rentals/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (status !== "Completed" && status !== "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Status must be Completed or Cancelled"
      });
    }

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    rental.status = status;
    await rental.save();

    const property = await Property.findById(rental.propertyId);
    if (property) {
      property.status = "Available";
      await property.save();
    }

    const updatedRental = await Rental.findById(rental._id).populate("propertyId").populate("customerId", "name email phone");

    res.status(200).json({
      success: true,
      message: `Rental ${status.toLowerCase()} successfully`,
      rental: updatedRental
    });
  } catch (error) {
    console.log("Update Rental Status Error:");
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
