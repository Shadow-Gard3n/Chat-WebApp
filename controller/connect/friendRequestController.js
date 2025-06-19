const FriendRequest = require('./../../model/friendRequest');
const User = require('./../../model/user');

const sendFriendRequest = async (req, res) => {
  const { fromUsername, toUsername } = req.params;
  console.log("fromUsername:", fromUsername);
  console.log("toUsername:", toUsername);


  try {
    // users exist ??
    const fromUser = await User.findOne({ username: fromUsername });
    const toUser = await User.findOne({ username: toUsername });


    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // if request already exist
    const existingRequest = await FriendRequest.findOne({
      from: fromUsername,
      to: toUsername
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // create new friend request
    const newRequest = await FriendRequest.create({
        from: fromUsername,
        to: toUsername,
        status: "pending"
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      request: newRequest
    });

  } catch (err) {
    console.error("Friend request error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = sendFriendRequest;
