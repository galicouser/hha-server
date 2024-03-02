const app = require("express");
const router = app.Router();

const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const emailService = require("../utils/emailService");

router.post("/signup-user", authController.signupUser);
router.post("/get-users", authController.FetchUsers);
router.post("/update-users", authController.UpdateUsers);
router.post("/login-user", authController.loginUser);
router.get("/send-token/:email/:verify_token", emailService.sendEmail);
router.post("/verify", authMiddleware.verifyUserEmail);
router.get("/verifyuser", authMiddleware.verifyUserApproval);
router.post("/forgot-password", authController.initiateResetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-profile-picture", authController.changeProfilePicture);


module.exports = router;
