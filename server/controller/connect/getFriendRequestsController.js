const FriendRequest = require('./../../model/friendRequest');

const getFriendRequests = async (req, res) => {
  const username = req.params.username; 

  try {
    // all requests where user is either sender or receiver
    const sent = await FriendRequest.find({ from: username });
    const received = await FriendRequest.find({ to: username });
    res.json({
      sentRequests: sent,
      receivedRequests: received,
    });
  } catch (err) {
    console.error('Error fetching friend requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getFriendRequests;
