const express = require('express');

const {registerUser, loginUser, getUserData, deleteUser, listUsers, addAddress, userData, deleteAddress, forgotPassword, verifyResetPassword} = require('../Controller/userController');
const validateAccessToken = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/get',validateAccessToken,getUserData)
router.delete('/delete',validateAccessToken,deleteUser);
router.get('/list/:page',validateAccessToken,listUsers);
router.post('/address',validateAccessToken,addAddress);
router.get('/getuser/:id',validateAccessToken,userData)
router.delete('/address',validateAccessToken,deleteAddress)
router.post('/forgot-password', forgotPassword);
router.put('/verify-reset-password',verifyResetPassword);
module.exports = router;

