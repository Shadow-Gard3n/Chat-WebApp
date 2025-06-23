const router = require('express').Router();

// get all friends of user
router.get('/:username/friends', require('./../controller/connect/connectedUserController')); 
// get all search users
router.get('/search', require('./../controller/searchController'));
// send request to search users
router.post('/:fromUsername/friend-request/:toUsername', require('./../controller/connect/friendRequestController'));
// accept or reject request 
router.patch('/friend-request/:requestId', require('./../controller/connect/requestStatusController'));
// get all friend request of user (recieved + sent)
router.get('/:username/friend-request', require('./../controller/connect/getFriendRequestsController'));
// get chat history of user
router.get('/chatsFrom/:sender/to/:receiver', require('./../controller/getUserChat'))

module.exports = router;
