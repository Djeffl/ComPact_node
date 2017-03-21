let express = require('express');
let router = express.Router();
//Require ROUTES
let assignmentRoute = require("./assignmentRoutes");
let userRoute = require("./userRoutes");

router.use('/users', userRoute);
router.use('/assignments', assignmentRoute);

module.exports = router;