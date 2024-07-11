// const User = require('../mode/User');
// const AccessToken = require('../mode/AccessToken');
const jwt = require('jsonwebtoken');
const jwtSecret = "excellencetech"
const validateAccessToken=(req,res,next)=>{
    // const accessToken= req.headers['authorization']
    // console.log('Received access token:', accessToken);
    // if(!accessToken){
    //     return res.status(400).json({msg:'Access token missing'});
    // }

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
    // try {
    //     const tokenRecord = await AccessToken.findOne({access_token:accessToken}).populate('user_id');
    //     if(!tokenRecord){
    //         return res.status(400).json({msg:'Invalis Access Token'});
    //     }
    //     if(tokenRecord.expiry <new Date()){
    //         return res.status(400).json({msg:"Access Token Expired"});
    //     }
    //     req.user = tokenRecord.user_id;
    //     next();
    // } catch (error) {
    //     console.error(error.message)
    //     res.status(500).send('Server error');
    // }

    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
    const accessToken = token.split(' ')[1];
    if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
        return res.status(401).json({ msg: 'Invalid token format' });
    }
    try { 
        const decoded = jwt.verify(accessToken, jwtSecret);  
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = validateAccessToken;







