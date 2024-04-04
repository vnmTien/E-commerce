const router = require('express').Router();
const { createProduct, getProduct, getAllProducts } = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post("/", [verifyAccessToken, isAdmin], createProduct);
router.get("/", getAllProducts);
router.get("/:pid", getProduct);

module.exports = router;