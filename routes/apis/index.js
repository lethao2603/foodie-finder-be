const router = require('express').Router();
router.use('/test', require('./test.route'));
//router.use('/admin/roles', require('./admin/role.route'));
router.use('/admin/users', require('./admin/user.route'));
router.use('/auth', require('./auth.route'));
router.use('/customer', require('./customer/customer.route') )
router.use('/restaurant', require("./restaurant/restaurant.router"));
router.use('/file', require('./file.route'));
const router = require("express").Router();
// router.use('/test', require('./test.route'));
//router.use('/admin/roles', require('./admin/role.route'));
//router.use('/admin/users', require('./admin/user.route'));
router.use("/auth", require("./auth.route"));

router.use("/restaurant", require("./restaurant/restaurant.router"));

router.use("/booking", require("./booking/booking.router"));

router.use("/menu", require("./menu/menu.route"));

router.use("/file", require("./file.route"));

module.exports = router;
