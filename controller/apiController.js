const {
  authenticateToken,
  generateAccessToken,
} = require("../middlewares/auth");
const Property = require("../model/property");
const User = require("../model/user");
const { isValidEmail } = require("../utils/validation");

// 1. Fetch all available properties
const getAllProperties = async (req, res) => {
  const all_properties = await Property.find({}).populate("owner", "-password");
  res.status(200).json({ all_properties });
};

// 2. Add a property
const addProperty = async (req, res) => {
  console.log(req.user.email);
  const { name, price, address, beds, bathrooms, area, type } = req.body;
  const owner = req.user.email;
  try {
    console.log("inside try catch");
    console.log(req.body);
    const property = new Property({
      owner,
      name,
      price,
      address,
      beds,
      bathrooms,
      area,
      type,
    });
    await property.save();
    res.status(201).send("Property added successfully.");
  } catch (err) {
    console.log("inside err");
    res.status(400).send(err.message);
  }
};

// 3. Update a property
const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { name, price, address, beds, bathrooms, area, type } = req.body;
    const owner = req.user.email;

    // Find the property by ID and owner
    console.log(propertyId);
    const property = await Property.findOne({ _id: propertyId, owner });

    if (!property) {
      return res.status(404).json({
        error: "Property not found or you do not have permission to update it.",
      });
    }
    // Update the property fields
    property.name = name;
    property.price = price;
    property.address = address;
    property.beds = beds;
    property.bathrooms = bathrooms;
    property.area = area;
    property.type = type;

    // Save the updated property
    await property.save();
    console.log(property);
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Delete a property
const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id; // Assuming you have a user object in the request after authentication

    // Check if the property exists and is owned by the authenticated user
    const property = await Property.findById(propertyId).exec();
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the authenticated user is the owner of the property
    if (property.owner !== userId) {
      return res.status(403).json({
        message: "Access denied. You are not the owner of this property.",
      });
    }

    // If the user is the owner, delete the property
    await Property.findByIdAndRemove(propertyId).exec();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. List my properties
const myProperty = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have a user object in the request after authentication
    // const userEmail = r;
    console.log(userId);
    // Find properties where the owner is the authenticated user
    const properties = await Property.find({ owner: userId }).exec();

    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6. Signup endpoint
const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create a new user document and save it to the database
    const newUser = new User({ email, password });
    await newUser.save();
    const userObject = {
      _id: newUser._id,
      email: newUser.email,
    };
    const token = generateAccessToken(userObject);
    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 7. Login endpoint
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userObject = {
      _id: user._id,
      email: user.email,
    };
    const token = generateAccessToken(userObject);
    return res.status(201).json({ message: "login succesfull", token: token });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Username/Password!" });
  }
};

module.exports = {
  getAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  myProperty,
  signUp,
  login,
};
