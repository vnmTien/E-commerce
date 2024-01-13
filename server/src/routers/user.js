const router = require('express').Router();
const { register, login, getCurrent, refreshAccessToken } = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post("/createUser", register);
router.post("/login", login);
router.get('/current', verifyAccessToken, getCurrent)
router.post('/refreshToken', refreshAccessToken)

module.exports = router;
