const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', auth, upload.single('file'), documentController.uploadDocument);
router.get('/', auth, documentController.getDocuments);
router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;