const { query } = require('express');

const router = require('express').Router();
// router.use('/test', require('./test.route'));
// router.use("/admin/users", require("./admin/user.route"));
router.use("/auth", require("./auth.route"));

router.use("/user", require("./admin/user.route"));

router.use("/restaurant", require("./restaurant/restaurant.router"));

router.use("/booking", require("./booking/booking.router"));

router.use("/menu", require("./menu/menu.route"));

router.use("/review", require("./review/review.router"));

router.use("/file", require("./file.route"));

router.use("/category", require("./category/category.router"));

router.use("/admin/category", require("../apis/admin/category.route"))

router.use("/recommendation", require("./recommendation.route"))

module.exports = router;
