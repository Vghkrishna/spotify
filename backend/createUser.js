const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const createRegularUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: "user@spotify.com" });
    if (existingUser) {
      console.log("Regular user already exists!");
      console.log("Email: user@spotify.com");
      console.log("Password: user123");
      console.log("Username: user");
      process.exit(0);
    }

    // Create regular user
    const regularUser = await User.create({
      username: "user",
      email: "user@spotify.com",
      password: "user123",
      isAdmin: false,
    });

    console.log("✅ Regular user created successfully!");
    console.log("Email: user@spotify.com");
    console.log("Password: user123");
    console.log("Username: user");
    console.log("Admin status:", regularUser.isAdmin);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating regular user:", error);
    process.exit(1);
  }
};

createRegularUser();
