const router = require("express").Router();
const adminRoute = require("./adminRoute");
const userRoute = require("./userRoute");
const postRoute = require("./postRoute");

router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/post", postRoute);

module.exports = router;
