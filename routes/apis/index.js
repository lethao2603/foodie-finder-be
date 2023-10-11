const router = require('express').Router();

router.use('/test', require('./test.route'));
router.use('/admin/roles', require('./admin/role.route'));
router.use('/admin/users', require('./admin/user.route'));
router.use('/auth', require('./auth.route'));

module.exports = router;