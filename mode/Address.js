const mongoose = require('mongoose');

const addAddress = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pin_code:{
        type:Number,
        required:true
    },
    phone_no:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('Address',addAddress)