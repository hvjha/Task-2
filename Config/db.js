const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect('mongodb://localhost:27017/Express')
    console.log("Database is connected Successfully")
}
module.exports = connectDB;
