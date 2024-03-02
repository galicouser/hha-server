const nodemailer = require("nodemailer");

const sendTokenEmail = async (receiverEmail, verify_token,username) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.com", // Replace with the SMTP server for Mail.com
      port: 587, // Common port for SMTP. Use 465 for SSL.
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
    

    const approvalLink = `https://1738api.nocableneeded.net/auth/verifyuser?email=${encodeURIComponent(
      receiverEmail
    )}&verify_token=${encodeURIComponent(verify_token)}`;

    const ccedEmail = ['cutthecable@techie.com ']

    const sendTokenLink = `https://1738api.nocableneeded.net/auth/send-token/${encodeURIComponent(
      receiverEmail
    )}/${encodeURIComponent(verify_token)}`;


    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: receiverEmail,
      cc: ccedEmail,
      subject: "Email verification for " + receiverEmail,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

          <!-- Approval Card -->
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;">Greetings ${username}, and welcome to Cut The Cable entertainment.</p>
            <p style="font-size: 16px;">Thank you for signing up! Please click the button below to verify your account & complete your signup process:</p>
            <a href="${approvalLink}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Approve</a>
            <p style="font-size: 16px;">The attached videos will show you how to setup and use your CatchON TV app. You should view them in order:</p>
            <p style="font-size: 16px;"><a href="https://www.dropbox.com/s/sqi31lue8s6kqcr/HowToEnableDeveloperOptions.mp4?dl=0" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.dropbox.com/s/sqi31lue8s6kqcr/HowToEnableDeveloperOptions.mp4?dl=0">1. HowToEnableDeveloperOptions</a></p>
            <p style="font-size: 16px;"><a href="https://www.dropbox.com/s/p2kft3i4l7dkys2/DownloadCOTVapp.mp4?dl=0" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.dropbox.com/s/p2kft3i4l7dkys2/DownloadCOTVapp.mp4?dl=0">2. DownloadCOTVapp</a></p>
            <p style="font-size: 16px;"><a href="https://www.dropbox.com/s/9udmu489z39il8h/Activate%26NavigateCOTV.mp4?dl=0" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.dropbox.com/s/9udmu489z39il8h/Activate%26NavigateCOTV.mp4?dl=0">3. Activate&NavigateCOTV</a></p>
            <p style="font-size: 16px;"><a href="https://www.dropbox.com/s/rs3lmk1zx2i1vdc/BenefitsOfCOTV.mp4?dl=0" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.dropbox.com/s/rs3lmk1zx2i1vdc/BenefitsOfCOTV.mp4?dl=0">4. BenefitsOfCOTV</a></p>
            <p style="font-size: 16px;">The first file will show you how to enable the developer options on an Amazon Fire TV Stick.  You can use the CatchON TV app on any Android device.  The Fire TV Stick is the most popular.  For other devices such as cell phones and tablets, search for unlocking methods on the Internet.</p>
            <p style="font-size: 16px;">The second file shows you how to download the COTV app using the Downloader app by AFTV News. The URL address to enter into Downloader is <a href="https://tinyurl.com/catchontv19" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://tinyurl.com/catchontv19&amp;source=gmail&amp;ust=1700675035163000&amp;usg=AOvVaw3ox91XdtFLcwAR1grUert5">https://tinyurl.com/catchontv</a></p>
            <p style="font-size: 16px;">Once you have installed the COTV app, this video will explain how to activate the app and shows some basic operating details. Use this authorization code for a one-time 3-day free trial: <p style='color:rgb(40,167,69)!important'>2162c3620987654</p></p>
            <p style="font-size: 16px;">The last video just gives you a broad view of the app's capabilities. The default parental code is <strong>0000</strong>.</p>
            <p style="font-size: 16px;">Enjoy, and thank you.</p>
            <p style="font-size: 16px;">Cheers</p>
            <p style="font-size: 16px;">CTC</p>
          </div>

          <p style="margin-top: 20px;"><strong>Note: After clicking verification you will be redirected to verification page, if verification is successfull you will be shown your Username, please keep it save for Login.</strong></p>
      </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return reject({ message: "Error has occurred" });
      }
      return resolve({ message: "Email sent!" });
    });
  });
};



const sendEmail = async (req, res) => {
  const { email, verify_token } = req.params; // Use req.params to access route parameters
  if (!email || !verify_token) {
    console.log("Receiver email or verification token is missing.");
    return res.status(400).json({ message: "Receiver email or verification token is missing." });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.com", // Replace with the SMTP server for Mail.com
      port: 587, // Common port for SMTP. Use 465 for SSL.
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const approvalLink = `https://1738api.nocableneeded.net/auth/verifyuser?email=${encodeURIComponent(
      email
    )}&verify_token=${encodeURIComponent(verify_token)}`;

    // <input
    //   type="text"
    //   id="verificationToken"
    //   value="${verify_token}"
    //   readonly
    //   style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;"
    // >


    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Verify your NOCABLESNEEDED Account!",
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Approval Card -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">Thank you for signing up! To verify your email address, please click the button below to verify your account & complete your signup process:</p>


        <a href="${approvalLink}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Approve</a>

      </div>
    </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent!" });
    });
  } catch (err) {
    console.log("Error sending email", err);
    return res.status(500).json({ message: "Error sending email" });
  }
};


const sendEmails = async (email,BCCemail,message,subject) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.com", // Replace with the SMTP server for Mail.com
      port: 587, // Common port for SMTP. Use 465 for SSL.
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: email,
      bcc: BCCemail,
      subject: subject,
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- message body -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">${message}</p>
      </div>
    </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return reject({ message: "Error has occurred" });
      }
      return resolve({ message: "Email sent!" });
    });
  });
};

const resetPasswordEmail = async (receiverEmail, verify_token) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.com", // Replace with the SMTP server for Mail.com
      port: 587, // Common port for SMTP. Use 465 for SSL.
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const approvalLink = `https://nocableneeded.net/auth/api/verify?email=${encodeURIComponent(
      receiverEmail // Use 'email' from route parameters
    )}&verify_token=${encodeURIComponent(verify_token)}`;

    const sendTokenLink = `https://nocableneeded.net/auth/send-token/${encodeURIComponent(
      receiverEmail
    )}/${encodeURIComponent(verify_token)}`;

    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: receiverEmail,
      subject: "Password Reset verification for " + receiverEmail,
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Approval Card -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">To verify your email address, please copy the referral code below and use it to complete your reset password process:</p>

        <!-- Verification Token Text Box -->
        <input
          type="text"
          id="verificationToken"
          value="${verify_token}"
          readonly
          style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;"
        >

      </div>
    </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return reject({ message: "error has occured" });
      }
      return resolve({ message: "Email sent!" });
    });
  });
};


module.exports = { sendEmail, sendTokenEmail, resetPasswordEmail,sendEmails };
