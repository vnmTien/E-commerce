const router = require('express').Router();
const { register } = require('../controllers/user');

router.post("/createUser", register);

module.exports = router;
