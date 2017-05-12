const express = require('express');
const router = express.Router();
const token = require('../objects/token');
//Require ROUTES
const authRoute = require("./authRoutes");
const assignmentRoute = require("./assignmentRoutes");
const userRoute = require("./userRoutes");
const paymentRoute = require("./paymentRoutes");
const locationRoutes = require("./locationRoutes");
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