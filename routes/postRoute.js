const router = require("express").Router();
const {
  create,
  getAllPosts,
  getPost,
  update,
  deletePost,
} = require("../controllers/postController");
const { authenticate } = require("../middleware/auth/authenticate");

router.get("/all-posts", getAllPosts);
router.get("/post/:identifier", getPost);
router.post("/create-post", authenticate, create);
router.put("/update-post/:identifier", authenticate, update);
router.delete("/delete-post/:identifier", authenticate, deletePost);

module.exports = router;
