const router = require('express').Router();

const apisRouter = require('./apis');

router.use('/api', apisRouter);

module.exports = router;