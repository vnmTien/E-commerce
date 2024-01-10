const router = require('express').Router();
const { register, login } = require('../controllers/user');

router.post("/createUser", register);
router.post("/login", login);

module.exports = router;
