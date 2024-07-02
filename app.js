
const express = require('express');
const connectDB = require('./Config/db')
const userRoutes = require('./routes/userRoutes')
const app = express();

connectDB();

app.use(express.json());
app.use('/user',userRoutes);
const PORT = 4000;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})