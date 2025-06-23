const router = require('express').Router();

router.post('/signup',require('./../controller/auth/signupController'));
router.post('/login',require('./../controller/auth/loginController'));
router.get('/refresh',require('./../controller/auth/refreshController'));
router.get('/logout',require('./../controller/auth/logoutController'));

module.exports = router;