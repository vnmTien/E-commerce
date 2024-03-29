const router = require('express').Router();
const { register, login, getCurrent, refreshAccessToken, logout, forgotPassword, resetPassword, getAll, deleteUser, updateUser } = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post("/createUser", register);
router.post("/login", login);
router.get('/current', verifyAccessToken, getCurrent);
router.post('/refreshToken', refreshAccessToken);
router.get('/logout', logout);
router.get('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/', [verifyAccessToken, isAdmin], getAll);
router.delete('/', [verifyAccessToken, isAdmin], deleteUser);
router.put('/current', verifyAccessToken, updateUser)

module.exports = router;
