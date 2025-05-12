const router = require("express").Router();
const {
  getAllUser,
  restoreUser,
  deleteUser,
  deletedUsers,
  postRestore,
  deletePost,
  deletedPostsParanoid,
  getPendingPost,
  postPublishedUpdate,
  Logs,
} = require("../controllers/adminController");
const { authenticate, isAdmin } = require("../middleware/auth/authenticate");

router.get("/logs", authenticate, isAdmin, Logs);
router.get("/all-user", authenticate, isAdmin, getAllUser);
router.post("/restore-user/:id", authenticate, isAdmin, restoreUser);
router.get("/deleted-user", authenticate, isAdmin, deletedUsers);
router.delete("/delete-user/:id", authenticate, isAdmin, deleteUser);

router.get("/pending-posts", authenticate, isAdmin, getPendingPost);
router.put(
  "/pendind-post-update/:id",
  authenticate,
  isAdmin,
  postPublishedUpdate
);

router.post("/restore-post/:identifier", authenticate, isAdmin, postRestore);
router.delete("/delete-post/:identifier", authenticate, isAdmin, deletePost);
router.get("/all-deleted-posts", authenticate, isAdmin, deletedPostsParanoid);

module.exports = router;
