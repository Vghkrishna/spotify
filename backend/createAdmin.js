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

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@spotify.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@spotify.com");
      console.log("Password: admin123");
      console.log("Username: admin");
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@spotify.com",
      password: "admin123",
      isAdmin: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@spotify.com");
    console.log("Password: admin123");
    console.log("Username: admin");
    console.log("Admin status:", adminUser.isAdmin);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
