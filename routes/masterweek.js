const app = require("express");
const router = app.Router();

const masterweekController = require("../controller/masterweekController");

router.get("/getmasterweeks", masterweekController.getmasterweeks);
router.get("/getmasterweeksById", masterweekController.getmasterweeksById);
router.post("/deleteMasterWeekById", masterweekController.deleteMasterWeekById);
router.post("/updateMasterWeekById", masterweekController.updateMasterWeekById);
router.post("/addMasterWeek", masterweekController.addMasterWeek);
router.get("/getmasterweeksByMemberId", masterweekController.getmasterweeksByMemberId);




module.exports = router;
