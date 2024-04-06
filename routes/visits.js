const app = require("express");
const router = app.Router();

const visitController = require("../controller/visitController");

router.post("/postvisit", visitController.postvisit);
router.get("/getvisits", visitController.getvisits);
router.post("/updatevisit", visitController.updatevisits);
router.get("/getVisitById", visitController.getVisitById);
router.get("/getVisitByMemberId", visitController.getVisitByMemberId);
router.post("/deleteVisitById", visitController.deleteVisitById);
router.get("/getVisitByCaregiverID", visitController.getVisitByCaregiverID);


module.exports = router;
