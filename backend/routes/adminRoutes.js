const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  toggleUserAdmin,
  getAdminStats,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// All admin routes require authentication and admin privileges
router.use(auth);
router.use(admin);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/toggle-admin", toggleUserAdmin);
router.get("/stats", getAdminStats);

module.exports = router;
