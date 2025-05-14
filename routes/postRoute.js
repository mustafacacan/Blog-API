const router = require("express").Router();
const {
  create,
  getAllPosts,
  getPost,
  update,
  deletePost,
} = require("../controllers/postController");
const { authenticate } = require("../middleware/auth/authenticate");
const chechkRole = require("../middleware/auth/role");

router.get("/all-posts", getAllPosts);
router.get("/post/:identifier", getPost);
router.post("/create-post", authenticate, chechkRole("post_create"), create);
router.put(
  "/update-post/:identifier",
  authenticate,
  chechkRole("post_update"),
  update
);
router.delete(
  "/delete-post/:identifier",
  authenticate,
  chechkRole("post_delete"),
  deletePost
);

module.exports = router;
