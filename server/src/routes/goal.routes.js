const express = require('express');
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', goalController.getGoals);

router.post(
    '/',
    [
        body('goalName').trim().notEmpty(),
        body('targetAmount').isFloat({ min: 0 }),
        body('deadline').isISO8601(),
        validate
    ],
    goalController.createGoal
);

router.get('/:id', goalController.getGoalById);
router.get('/:id/forecast', goalController.getForecast);
router.patch('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;