const router = require('express').Router();
const { createProduct, getProduct, getAllProducts, updateProduct } = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post("/", [verifyAccessToken, isAdmin], createProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], updateProduct);
router.get("/", getAllProducts);
router.get("/:pid", getProduct);


module.exports = router;