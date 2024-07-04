const User = require('../mode/User')
const bcrypt = require('bcrypt')
const Address = require('../mode/Address')
const AccessToken = require('../mode/AccessToken');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken')
// const md5 = require('md5');
const jwtSecret = "excellencetech"
exports.registerUser= async(req,res)=>{
    const {userName,password,confirmPassword,email,firstname,lastname} = req.body;



try{
    let user = await User.findOne({userName});
    if(user){
        return res.status(400).json({msg:'Username already Exist'})
    }

    if(password !== confirmPassword){
        return res.status(400).json({msg:'Password do not match'})
    }
    user = await User.findOne({email});
    if(user){
        return res.status(400).json({msg:'Email Already Exist'});
    }

    user = new User({
        userName,
        password,
        email,
        firstname,
        lastname
    });

    await user.save();
    res.status(201).json({msg:'User Registered successfully'})
}catch(err){
    console.log(err.message)
    res.status(500).send('server error')
}

};

exports.loginUser = async(req,res)=>{
    const {userName,password}=req.body;

    try {
        const user = await User.findOne({userName});
        if(!user){
            return res.status(400).json({msg:'Invalid UserName or Password'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid UserName or Password'});
        }
        // res.status(200).json({accessToken:user._id})
        // update code for access Token
// question 2 part -1
        // const accessToken = md5(crypto.randomBytes(16).toString('hex'));
        // const expiry = new Date(Date.now() + 3600000)
        // await AccessToken.create({
        //     user_id:user._id,
        //     access_token:accessToken,
        //     expiry
        // })
        // res.status(200).json({accessToken});
// question-3 part 1
        const data = {
            user:{
                id:user._id,
                userName:userName,
                email:user.email,
                firstname:user.firstname,
                lastname:user.lastname
            }
        }
        const authToken = jwt.sign(data,jwtSecret,{expiresIn:3600});
        res.status(201).json({authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

exports.getUserData = async(req,res)=>{
    try{
        const user = req.user;
       res.send(user)
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        const user=req.user;
        await User.findByIdAndDelete(user._id);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error")
    }
}

exports.listUsers= async(req,res)=>{
    const page = parseInt(req.params.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).select('-password');

    res.status(200).json(users);
}

exports.addAddress = async(req,res)=>{
    const {address,city,state,pin_code,phone_no}=req.body;
    const user_id = req.user.id;
    try {
        const newAddress = new Address({
            user_id,
            address,
            city,
            state,
            pin_code,
            phone_no
        })
        await newAddress.save()
        res.status(200).json({msg:'Address added successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error')
    }
}

exports.userData = async(req,res)=>{
    try {
        const user= req.user;
        const address = await Address.find({ user_id: user.id });
        res.send({user,address});
    } catch (error) {
        console.error(error.messahe);
        res.status(500).send('server error');
    }
}