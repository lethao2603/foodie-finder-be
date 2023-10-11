const router = require('express').Router();
const testController = require('../../controllers/test.controller');

router.get('/getSth', testController.getSth);

// router.get('/', employeeController.getAllEmployees)
// router.post('/',employeeController.addNewEmployee);
// router.get('/:id', employeeController.getEmployee);
module.exports = router;