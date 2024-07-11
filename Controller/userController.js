const User = require('../mode/User')
const bcrypt = require('bcrypt')
const Address = require('../mode/Address')
const AccessToken = require('../mode/AccessToken');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken')
// const md5 = require('md5');
const jwtSecret = "excellencetech"
const nodemailer = require("nodemailer");
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

// exports.loginUser = async(req,res)=>{
//     const {userName,password}=req.body;

//     try {
//         const user = await User.findOne({userName});
//         if(!user){
//             return res.status(400).json({msg:'Invalid UserName '});
//         }
//         const isMatch = await bcrypt.compare(password,user.password);
//         if(!isMatch){
//             return res.status(400).json({msg:'Invalid Password'});
//         }
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
//         const data = {
//             user:{
//                 id:user._id,
//                 userName:userName,
//                 email:user.email,
//                 firstname:user.firstname,
//                 lastname:user.lastname
//             }
//         }
//         const authToken = jwt.sign(data,jwtSecret,{expiresIn:3600});
//         res.status(201).json({authToken});
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error');
//     }
// }

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
        console.error(error.message);
        res.status(500).send('server error');
    }
}

exports.deleteAddress = async(req,res)=>{
    const {addressIds} = req.body;
    const userId = req.user.id;
    
    if(!Array.isArray(addressIds) || addressIds.length ===0){
        console.log("Invalid or missing address IDs");
        return res.status(400).json({msg:'Invalid or missing address IDs'})
    }
    try {
        console.log('Deleting addresses:', addressIds);
        const result = await Address.deleteMany({
            _id:{$in:addressIds},
            user_id:userId
        })
        console.log('Deletion result:', result);
        if(result.deletedCount === 0){
            return res.status(400).json({msg:"No address found for deletion"})
        }
        res.json({ msg: `Successfully deleted ${result.deletedCount} address(es)` });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'Server Error'})
    }
}

exports.forgotPassword = async(req,res)=>{
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'User with this email doesnot exist'})
        }
        const resetToken = jwt.sign({userId:user._id},jwtSecret,{expiresIn:'15m'})
        const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:"harshvardhanjha35363@gmail.com",
                pass:"ebza mdzb logy cgyu"
            }
        });
        const mailOptions = {
            from: 'harshvardhanjha35363@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You requested for a password reset. Please use the following token to reset your password: ${resetToken}`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({msg:'Password reset token sent to email'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'Server error'})
    }
}

exports.verifyResetPassword = async(req,res)=>{
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const {password,confirmPassword} = req.body;

    if(password != confirmPassword){
        return res.status(400).json({msg:'Password do not match'});
    }

    try {
        console.log("Token",token)
        const decode = jwt.verify(token,jwtSecret);
        const userId = decode.userId;

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({msg:'Invalid token or user does not exist'});
        }
        console.log("User before password reset:", user);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        console.log("User after password reset:", user);

        res.status(200).json({msg:'Password has been reset successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(400).json({msg:'Invalid or expired token'});
    }
}


exports.loginUser = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Username' });
        }

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        console.log("Password match status:", isMatch);

        const data = {
            user: {
                id: user._id,
                userName: userName,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            }
        };

        const authToken = jwt.sign(data, jwtSecret, { expiresIn: 3600 });
        res.status(201).json({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
