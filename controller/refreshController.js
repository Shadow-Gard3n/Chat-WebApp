const User = require('./../model/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefresh = async (req,res)=>{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (err, decoded)=>{
            if(err || foundUser.username != decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {username: decoded.username},
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '20m'}
            );
            res.json({accessToken}); 
        }
    )
}

module.exports = handleRefresh;
