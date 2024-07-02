const User = require('../mode/User')
const bcrypt = require('bcrypt')
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
        res.status(200).json({accessToken:user._id})
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
