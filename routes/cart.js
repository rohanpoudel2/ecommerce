const router = require('express').Router();
const Cart = require('../models/Cart');
const CryptoJS = require('crypto-js');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');


//Create 

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body)
  try {
    const savedCart = await newCart.save();
    res.status(200).json(
      {
        success: true,
        msg: savedCart
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//UPDATE
router.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Cart has been deleted..." });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//GET User Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      msg: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

// Get All

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({
      success: true,
      msg: carts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

module.exports = router;