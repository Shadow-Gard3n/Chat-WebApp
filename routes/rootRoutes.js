const router = require('express').Router();

router.post('/signup',require('./../controller/signupController'))
router.post('/login',require('./../controller/loginController'))
// router.get('/refresh',require('./../controller/refreshController'))

module.exports = router;