const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}

const registerUser = async (req, res)=>{
    const {name,email,password} =req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message: 'User already exists'});
    }
    const user = await User.create({
        name,
        email,
        password
    });
    if(user){
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,  
            isAdmin: user.isAdmin,
            token : generateToken(user._id,)
        });
    }
    else{
        res.status(400).json({message: 'Invalid user data'});
    }
}
const loginUser = async (req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(user && (await user.passwordMatch(password))){
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(401).json({message: 'Invalid email or password'});
    }
};

const getUserProfile = async (req,res)=>{
    const id= req.user._id;
    const user = await User.findById(id).select('-password');
    res.status(200).json(user);
};
const logoutUser = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
};