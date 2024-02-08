const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/password');


router.post('/forgotPasswordMail', passwordController.forgotPasswordMail);
router.get('/createNewPassword/:id',passwordController.createNewPassword);
router.post('/createNewPassword/:id', passwordController.postNewPassword)



module.exports = router;
