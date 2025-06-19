const router = require('express').Router();

router.post('/signup',require('./../controller/signupController'))
router.post('/login',require('./../controller/loginController'))
router.get('/refresh',require('./../controller/refreshController'))
router.get('/logout',require('./../controller/logoutController'))

module.exports = router;