// const User = require('../mode/User');
const AccessToken = require('../mode/AccessToken');
const validateAccessToken=async(req,res,next)=>{
    const accessToken= req.headers['authorization']
    console.log('Received access token:', accessToken);
    if(!accessToken){
        return res.status(400).json({msg:'Access token missing'});
    }

    // try {
    //     const user = await User.findById(accessToken);
    //     if(!user){
    //         return res.status(400).json({msg:'Invalid Access token'});
    //     }
    //     req.user = user;
    //     next();
    // } catch (error) {
    //     console.error(error.message);
    //     res.status(500).send('Server error')
    // }

    // updated code
    try {
        const tokenRecord = await AccessToken.findOne({access_token:accessToken}).populate('user_id');
        if(!tokenRecord){
            return res.status(400).json({msg:'Invalis Access Token'});
        }
        if(tokenRecord.expiry <new Date()){
            return res.status(400).json({msg:"Access Token Expired"});
        }
        req.user = tokenRecord.user_id;
        next();
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error');
    }
}

module.exports = validateAccessToken;




