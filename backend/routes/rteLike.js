const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const likeCtrl = require("../controllers/ctrlLike");

// Controllers settings
router.get("/post/:id/like", auth, likeCtrl.getPostLikes);
router.post("/post/:id/like", auth, likeCtrl.createLike);
router.delete("/post/:id/like", auth, likeCtrl.deleteLike);

// Exporting Router
module.exports = router;
