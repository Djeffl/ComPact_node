const express = require('express');
const router = express.Router();
const token = require('../services/token');
//Require ROUTES
const authRoute = require("./authentication");
const assignmentRoute = require("./assignment");
const userRoute = require("./user");
const paymentRoute = require("./payment");
const locationRoutes = require("./location");
const deviceRoutes = require('./device');
const testRoute = require("./test");

router.use('/auth', authRoute);
router.use('/users', userRoute);
//router.use('/users', token.verify, userRoute);
router.use('/assignements', assignmentRoute);
router.use('/payments', paymentRoute);
router.use('/locations', locationRoutes); //token.verify,
router.use('/devices', deviceRoutes);
router.use('/tests', testRoute);

module.exports = router;