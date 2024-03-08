const app = require("express");
const router = app.Router();

const visitController = require("../controller/visitController");

router.post("/postvisit", visitController.postvisit);
router.get("/getvisits", visitController.getvisits);
router.post("/updatevisit", visitController.updatevisits);

module.exports = router;
