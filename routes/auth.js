const app = require("express");
const router = app.Router();

const authController = require("../controller/visitController");

router.post("/postvisit", authController.postvisit);
router.post("/getvisit", authController.getvisit);
router.post("/updatevisit", authController.updatevisit);

module.exports = router;
