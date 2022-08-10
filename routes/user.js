const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');

router.patch('/:id', verifyToken, (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
  }
});

module.exports = router;