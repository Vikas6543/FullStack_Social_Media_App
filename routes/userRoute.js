const router = require('express').Router();
const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const isAuthenticated = require('../middlewares/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Register => done
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profilePicUrl } = req.body;

    // validation for the fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all the fields' });
    }

    // email regex validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // validation for the password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password should be atleast 6 characters long' });
    }

    // check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create a new user
    const newUser = new UserModel({
      name,
      email,
      password,
      profilePicUrl,
    });

    // save the user to the database
    const savedUser = await newUser.save();

    // dont send the password to the client
    savedUser.password = undefined;

    res.status(200).json({
      message: 'Registered successfully',
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Login => done
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all the fields' });
    }

    // check if the user exists
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // check if the password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // create a token
    const token = await user.createToken();

    // dont send the password to the client
    user.password = undefined;

    res.status(200).json({
      message: 'Logged in successfully',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get my profile details => done
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
      message: 'User details fetched successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update my profile details => done
router.put('/profileUpdate', isAuthenticated, async (req, res) => {
  try {
    const { name, email, profilePicUrl } = req.body;

    // find the logged in user
    const loggedInUser = await UserModel.findById(req.user.id);
    if (!loggedInUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // finally update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        profilePicUrl,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'User details updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Password => done
router.put('/updatePassword', isAuthenticated, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // validation for the fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Please enter all the fields' });
    }

    // check if the new password and confirm new password are same
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Both Passwords do not match' });
    }

    // find the logged in user
    const loggedInUser = await UserModel.findById(req.user.id).select(
      '+password'
    );

    // check if the old password is correct
    const isMatch = await loggedInUser.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // check if old and new password are same
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'Old & New Password are same' });
    }

    // check if the new password is atleast 6 characters long
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password should be atleast 6 characters long' });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // finally update the password
    await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all the users profile details => done
router.get('/allProfiles', isAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find().select('name profilePicUrl');

    res.status(200).json({
      message: 'All users fetched successfully',
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get a user profile details => done
router.get('/profile/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User details fetched successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Follow & Unfollow a user => done
router.put('/follow/:id', isAuthenticated, async (req, res) => {
  try {
    // check if the user exists
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // check if the user is already followed
    const isFollowed = user.followers.includes(req.user.id);
    if (isFollowed) {
      // unfollow the user if already followed
      await user.updateOne({ $pull: { followers: req.user.id } });

      // remove the user from the following list of the logged in user
      await UserModel.findByIdAndUpdate(req.user.id, {
        $pull: { following: req.params.id },
      });

      res.status(200).json({
        message: 'User unfollowed successfully',
      });
    } else {
      // follow the user
      await user.updateOne({ $push: { followers: req.user.id } });
      await UserModel.findByIdAndUpdate(req.user.id, {
        $push: { following: req.params.id },
      });

      res.status(200).json({
        message: 'User followed successfully',
        user,
      });
    }
  } catch (error) {}
});

// forgot password => done
router.post('/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body;

    // check if the email is entered
    if (!email) {
      return res
        .status(400)
        .json({ message: 'Please enter your email address' });
    }

    // check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email doesn't exists" });
    }

    let token = await TokenModel.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
    }

    // create a new token
    let resetToken = crypto.randomBytes(32).toString('hex');

    // save the token to the database by hashing it
    const hash = await bcrypt.hash(resetToken, 10);

    token = new TokenModel({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    });

    await token.save();

    // send the token to the user's email
    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user._id}`;

    // configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // create the email message
    const message = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
      <p style="font-family: Arial, sans-serif; font-size: 24px; color: #333;">Hi <span style="font-weight: 600">${user.name}</span></p>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #666;">Please click on the below button to reset your password, & remember the reset password link will get expire in 30 minutes.</p>
<a href=${resetLink} style="display: inline-block; padding: 10px 18px; font-family: Arial, sans-serif; font-size: 14px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 5px;">Reset Password</a>
      `,
    };

    // send the email
    await transporter.sendMail(message);

    res
      .status(200)
      .json({ message: 'Reset Password Link has been sent to your email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// reset password => done
router.post('/resetPassword', async (req, res) => {
  try {
    const { resetPassword, token, id } = req.body;

    // find password reset token
    let passwordResetToken = await TokenModel.findOne({ userId: id });

    if (!passwordResetToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // if token is found, check if it is valid
    const isMatch = await bcrypt.compare(token, passwordResetToken.token);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // check if the password is valid
    if (resetPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // hash the password and save it to the database
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetPassword, salt);

    // update the password in the database
    const user = await UserModel.findByIdAndUpdate(id, {
      password: hash,
    });

    // delete the token from the database
    await passwordResetToken.deleteOne();

    res.status(200).json({ message: 'Password has been changed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
