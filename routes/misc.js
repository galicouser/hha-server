const app = require("express");
const router = app.Router();

const miscController = require("../controller/miscController");

router.get("/getmisc", miscController.getmisc);

module.exports = router;
