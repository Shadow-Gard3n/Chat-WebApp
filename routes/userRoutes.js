const router = require('express').Router();

router.post('/:fromUsername/friend-request/:toUsername', require('./../controller/connect/friendRequestController'));
router.patch('/friend-request/:requestId', require('./../controller/connect/requestStatusController'));
router.get('/search', require('./../controller/searchController'));
router.get('/:username/friends', require('./../controller/connect/connectedUserController'));

module.exports = router;
