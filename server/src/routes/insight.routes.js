const express = require('express');
const insightController = require('../controllers/insightController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', insightController.getInsights);
router.post('/generate', insightController.generateInsights);
router.patch('/:id/read', insightController.markAsRead);

module.exports = router;