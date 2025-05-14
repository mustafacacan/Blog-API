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
const {
  createRole,
  createPermissions,
  addPermissionToRole,
  addRoleToUser,
  removeRoleFromUser,
  getRoleUsers,
  getAllRolesAndPermissions,
} = require("../controllers/rolePermissionsController");
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

router.post("/create-role", authenticate, isAdmin, createRole);
router.post("/create-permission", authenticate, isAdmin, createPermissions);
router.post("/add-permission-role", authenticate, isAdmin, addPermissionToRole);
router.put("/add-role-user", authenticate, isAdmin, addRoleToUser);
router.delete("/remove-role-user", authenticate, isAdmin, removeRoleFromUser);
router.get("/get-role-users", authenticate, isAdmin, getRoleUsers);
router.get("/all-roles", authenticate, isAdmin, getAllRolesAndPermissions);

module.exports = router;
