const FriendRequest = require('./../../model/friendRequest');
const ConnectedUsers = require('./../../model/connectedUser');

const requestStatusHandler = async (req, res)=>{
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accept', 'reject'].includes(status)) {
        return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }

    try {
        // find request by id
        const request = await FriendRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: 'Friend request not found.' });

        // check if prehandled
        if (request.status !== 'pending') return res.status(400).json({ message: `Friend request already ${request.status}.` });

        // saving in connectedUser
        if (status === 'accept') {
            const from = request.from;
            const to = request.to;

            await ConnectedUsers.findOneAndUpdate(
                { username: from },
                { $addToSet: { connectedUsers: to } },
                { upsert: true, new: true }
            );

            await ConnectedUsers.findOneAndUpdate(
                { username: to },
                { $addToSet: { connectedUsers: from } },
                { upsert: true, new: true }
            );

        }

        // updating status in friendrequest db
        request.status = (status === 'accept' ? 'accepted' : 'rejected');
        await request.save();

        return res.status(200).json({
            message: `Friend request ${request.status} successfully.`,
            request
        });

    } catch (err) {
        console.error("Error updating friend request status:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = requestStatusHandler;