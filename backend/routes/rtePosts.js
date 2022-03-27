const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/mutler-config");

const postCtrl = require("../controllers/ctrlPosts");

// Controllers settings
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updatePost);
router.delete("/:id", multer, postCtrl.deletePost);

// Exporting Router
module.exports = router;
