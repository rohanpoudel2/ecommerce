const router = require('express').Router();
const Product = require('../models/Product');
const CryptoJS = require('crypto-js');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');


//Create 

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({
      success: true,
      msg: savedProduct
    });
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
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: updatedProduct
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
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Product has been deleted..." });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

//GET Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

// GET ALL Product
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCat = req.query.category;
  try {

    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCat) {
      products = await Product.find({
        categories: {
          $in: [qCat],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json({
      success: true,
      msg: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    });
  }
});

module.exports = router;