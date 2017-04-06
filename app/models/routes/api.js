let express = require('express');
let router = express.Router();
let token = require('../lib/token');
//Require ROUTES
let authRoute = require("./authRoutes");
let assignmentRoute = require("./assignmentRoutes");
let userRoute = require("./userRoutes");

router.use('/auth', authRoute);
router.use('/users', userRoute);
//router.use('/users', token.verify, userRoute);
router.use('/assignments', assignmentRoute);

module.exports = router;