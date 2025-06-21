const router = require('express').Router();

router.post('/:fromUsername/friend-request/:toUsername', require('./../controller/connect/friendRequestController'));
router.patch('/friend-request/:requestId', require('./../controller/connect/requestStatusController'));
router.get('/:username/friend-request', require('./../controller/connect/getFriendRequestsController'));
router.get('/search', require('./../controller/searchController'));
router.get('/:username/friends', require('./../controller/connect/connectedUserController'));

module.exports = router;
