let express = require('express');
let router = express.Router();
let token = require('../lib/token');
//Require ROUTES
let authRoute = require("./authRoutes");
let assignmentRoute = require("./assignmentRoutes");
let userRoute = require("./userRoutes");
let paymentRoute = require("./paymentRoutes");
let locationRoutes = require("./locationRoutes");
const deviceRoutes = require('./deviceRoutes');
const testRoute = require("./testRoutes");

router.use('/auth', authRoute);
router.use('/users', userRoute);
//router.use('/users', token.verify, userRoute);
router.use('/assignments', assignmentRoute);
router.use('/payments', paymentRoute);
router.use('/locations', locationRoutes); //token.verify,
router.use('/devices', deviceRoutes);
router.use('/tests', testRoute);

module.exports = router;