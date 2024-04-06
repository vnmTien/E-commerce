const router = require('express').Router();
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post("/", [verifyAccessToken, isAdmin], createProduct);
router.get("/", getAllProducts);

router.put("/:pid", [verifyAccessToken, isAdmin], updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], deleteProduct);
router.get("/:pid", getProduct);


module.exports = router;