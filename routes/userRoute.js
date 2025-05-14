const router = require("express").Router();
const {
  register,
  login,
  update,
  deleteUser,
  getUser,
  getPostUserPublished,
  getPostUserPending,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth/authenticate");
const chechkRole = require("../middleware/auth/role");

router.post("/register", register);
router.post("/login", login);
router.put("/update-user", authenticate, chechkRole("user_update"), update);
router.delete(
  "/delete-user",
  authenticate,
  chechkRole("user_delete"),
  deleteUser
);
router.get("/profile", authenticate, chechkRole("user_read"), getUser);
router.get(
  "/user-posts-published",
  authenticate,
  chechkRole("post_editor"),
  getPostUserPublished
);
router.get(
  "/user-posts-pending",
  authenticate,
  chechkRole("post_editor"),
  getPostUserPending
);

module.exports = router;
