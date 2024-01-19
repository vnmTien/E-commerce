const router = require('express').Router();
const { register, login, getCurrent, refreshAccessToken, logout } = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post("/createUser", register);
router.post("/login", login);
router.get('/current', verifyAccessToken, getCurrent);
router.post('/refreshToken', refreshAccessToken);
router.get('/logout', logout);

module.exports = router;
