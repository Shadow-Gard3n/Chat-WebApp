const User = require('./../model/user');
const bcrypt = require('bcrypt')

const handleNewUser = async (req,res)=>{
    const {name, pass} = req.body;
    if(!name || !pass) return res.status(400).json({'message':"Username and password are required"});

    const duplicate = await User.findOne({username: name}).exec();
    if (duplicate) return res.sendStatus(409); //for conflict

    try{
        const hashpass = await bcrypt.hash(pass, 10);
        
        // adding new user in database
        const result = await User.create({
            "username": name,
            "password": hashpass
        });

        console.log(result);

        res.status(201).json({'success': `New user ${name} created.`})
        
    }
    catch(err){
        res.status(500).json({'message': err.message});
    }
}

module.exports = handleNewUser