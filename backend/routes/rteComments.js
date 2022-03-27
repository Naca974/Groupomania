const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/mutler-config");

const commentCtrl = require("../controllers/ctrlComments");

// Controllers settings
router.get("/:id/comments", auth, commentCtrl.getAllComments);
router.post("/:id/new", auth, multer, commentCtrl.createComment);
router.delete("/:id/delete", auth, commentCtrl.deleteComment);

// Exporting Router
module.exports = router;
