const User = require('./../../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res)=>{
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({'message': "Username and Password are required"});

    const foundUser = await User.findOne({username: username}).exec();
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(password, foundUser.password);

    if (match){
        //jwt token
        const accessToken = jwt.sign(
            {
                "username": foundUser.username
            },
            process.env.ACCESS_TOKEN_KEY,
            {expiresIn: '20m'}
        );

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_KEY,
            {expiresIn: '5d'}
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 5*24*60*60*1000});
        res.json({accessToken});
    }
    else {
        res.sendStatus(401);
    }
}

module.exports = handleLogin;