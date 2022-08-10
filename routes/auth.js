const router = require('express').Router();
const user = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


//Register
router.post('/register', async (req, res) => {
  const newUser = new user({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  });
  await newUser.save().then(() => {
    const { password, ...others } = newUser._doc;
    res.status(201).json({
      success: true,
      msg: others
    });
  }).catch((error) => {
    res.status(500).json({
      success: false,
      msg: error
    });
  });
});

//Login
router.post('/login', async (req, res) => {

  try {
    const User = await user.findOne({ username: req.body.username });

    const originalpassword = CryptoJS.AES.decrypt(User.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);

    if (!User || originalpassword !== req.body.password) {
      res.status(401).json({
        success: false,
        msg: 'Wrong Credentials!!!'
      });
    } else {
      const { password, ...others } = User._doc;
      const accessToken = jwt.sign(
        {
          id: User._id,
          isAdmin: User.isAdmin
        },
        "" + process.env.JTW_SEC,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        success: true,
        msg: { ...others, accessToken }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }

});


module.exports = router;