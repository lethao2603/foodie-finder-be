<<<<<<< HEAD
const { query } = require('express');

const router = require('express').Router();
=======
const router = require("express").Router();
>>>>>>> 702ca013e813f6f4f8447be029ea0f35ec352d5d
// router.use('/test', require('./test.route'));
// router.use("/admin/users", require("./admin/user.route"));
router.use("/auth", require("./auth.route"));
router.use("/customer", require("./customer/customer.route"));
router.use("/restaurant", require("./restaurant/restaurant.router"));
router.use("/file", require("./file.route"));

router.use("/restaurant", require("./restaurant/restaurant.router"));

router.use("/booking", require("./booking/booking.router"));

router.use("/menu", require("./menu/menu.route"));

router.use("/file", require("./file.route"));

router.use("/category", require("./category/category.router"));

module.exports = router;
