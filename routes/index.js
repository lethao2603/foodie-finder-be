const router = require('express').Router();

router.use('/api', require('./apis'));

module.exports = router;