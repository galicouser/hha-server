const { visit } = require("../models/visit");

exports.postvisit = async (req, res) => {
  
  let newUser = new User({
   
  });
  try {
    const savedUser = await newUser.save();
    await sendTokenEmail(email, verificationToken,userName);
    console.log("User saved");
    return res.status(200).send({ message: "User saved!" });
  } catch (err) {
    console.log("Account not saved", err);
    return res.status(400).send({ message: "Account not saved" });
  }

};


exports.updatevisit = async (req, res) => {
  try {
    // Exclude users with email "admin@galico.io" from the query
    const users = await User.find({ email: { $ne: "admin@galico.io" },deleted: false });

    if (users.length === 0) {
      return res.status(200).send({ message: 'No entries found' });
    }

    const userArray = [];
    for (const user of users) {
      const mergedusers = {
        id: user._id,
        name: user.userName,
        email: user.email,
        verified: user.isVerified
      };
      userArray.push(mergedusers);
    }

    const response = {
      message: `Fetched ${users.length} entries`,
      data: userArray,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};


exports.getvisit = async (req, res) => {
  try {
    const { id, action } = req.body;

    let user = await User.findOne({
      _id: id,
    });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile_picture with the new URL
    if(action =='deactivate'){
      user.isVerified = false;
    }
    else if(action=='deleteuser'){
      user.deleted = true;
    }
    else{
      user.isVerified = true;
    }
  
    // Save the updated user document
    const updatedUser = await user.save();

    // Respond with the updated user document or a success message
    return res.status(200).json({ message: 'User ' + action, user: updatedUser });
  } catch (error) {
    console.error('Error change user status:', error);
    return res.status(500).json({ message: 'An error occurred while changing user status' });
  }
};

exports.loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error)
    return res
      .status(400)
      .send({ message: "Error. Enter data in correct form" });

  const { userName, password } = req.body;

  let user = await User.findOne({
    userName: userName,
    deleted: false,
    isVerified : true,
  });

  if (!user) return res.status(404).send({ message: "Account not found" });
  const hashedPassword = await bcrypt.compare(password, user.password);
  if (!hashedPassword)
    return res.status(404).send({ message: "Invalid email or password" });

  const token = jwt.sign({ userId: user._id.toString() }, "userToken");
  if (!token)
    res.status(400).json({
      message: "Token is empty",
      data: token,
    });
  else {
    return res.status(200).json({
      token: token,
      userName: user.userName,
      email: user.email,
      verified: user.isVerified,
      profile_picture: user.profile_picture
    });
  }
};

exports.changeProfilePicture = async (req, res) => {
  try {
    const { userName, newProfilePictureUrl } = req.body;

    let user = await User.findOne({
      userName: userName,
    });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile_picture with the new URL
    user.profile_picture = newProfilePictureUrl;
    console.log(newProfilePictureUrl)

    // Save the updated user document
    const updatedUser = await user.save();

    // Respond with the updated user document or a success message
    return res.status(200).json({ message: 'Profile picture updated', user: updatedUser });
  } catch (error) {
    console.error('Error changing profile picture:', error);
    return res.status(500).json({ message: 'An error occurred while changing the profile picture' });
  }
};



exports.initiateResetPassword = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send({ message: "Wrong email entered" });
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) return res.status(404).send({ message: "Account not found" });

  const randomInt = crypto.randomInt(0, 10000);
  const verificationCode = randomInt.toString().padStart(5, "0");

  user.verificationToken = verificationCode;
  const codeUpdated = await user.save();
  if (codeUpdated) {
    await resetPasswordEmail(email, verificationCode);
    return res
      .status(200)
      .send({ message: "Email sent with verification code" });
  } else {
    return res.status(400).send({ message: "Error! email not sent" });
  }
};

exports.resetPassword = async (req, res) => {
  const { error } = validateResetPasswordCredentials(req.body);
  if (error) {
    console.log("validation error : ", error);

    return res.status(400).send({ message: "Wrong data entered" });
  }
  const { email, verificationToken, password } = req.body;

  const user = await User.findOne({
    email: email,
    verificationToken: verificationToken,
  });
  if (!user)
    return res.status(404).send({ message: "Wrong verification code entered" });

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  const updatedUser = await user.save();
  if (updatedUser)
    return res.status(200).send({ message: "password changed successfully!" });
  else {
    console.log("password not changed ");

    return res.status(400).send({ message: "password not changed" });
  }
};