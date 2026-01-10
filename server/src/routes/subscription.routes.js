const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', subscriptionController.getSubscriptions);
router.post('/scan', subscriptionController.scanSubscriptions);

module.exports = router;