const router = require('express').Router();
const Order = require('../models/Order');
const CryptoJS = require('crypto-js');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');


//Create 

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body)
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(
      {
        success: true,
        msg: savedOrder
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
router.patch("/:id", verifyTokenAndAdmin, async (req, res) => {

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Order has been deleted..." });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//GET User Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      msg: orders
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
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      msg: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//Get Monthly Income

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {

    const income = await Order.aggregate(
      [
        {
          $match: { createdAt: { $gte: previousMonth } }
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount"
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" }
          }
        }
      ]
    );
    res.status(200).json(
      {
        success: true,
        msg: income
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

module.exports = router;