const express = require('express');

const {registerUser, loginUser, getUserData, deleteUser, listUsers} = require('../Controller/userController');
const validateAccessToken = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/get',validateAccessToken,getUserData)
router.delete('/delete',validateAccessToken,deleteUser);
router.get('/list/:page',listUsers);
module.exports = router;