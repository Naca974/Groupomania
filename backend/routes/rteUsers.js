const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/ctrlUsers");

const auth = require("../middleware/auth");
const checkEmail = require("../middleware/validator");
const multer = require("../middleware/mutler-config");

// Controllers settings
router.post("/signup", userCtrl.signup);
router.post("/login", checkEmail, userCtrl.login);
router.get("/profile", auth, userCtrl.getProfile);
router.delete("/:id/delete", auth, multer, userCtrl.deleteProfile);
router.put("/profile", auth, multer, userCtrl.updateProfile);

// Exporting Router
module.exports = router;
