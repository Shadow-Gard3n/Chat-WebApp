const User = require('./../model/user');

const searchHandler = async (req, res)=>{
    // like this search?username=Ary
    const { username } = req.query;  
    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username query is required' });
    }
    try{
        const users = await User.find({
            username: { $regex: username, $options: 'i' } // Ary will give names like aryan
        })

        if (users.length === 0) return res.status(404).json({ message: 'No users found' });

        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = searchHandler;