const express = require('express');
const multer = require('multer');
const { uploadImage, downloadImage, getUserImages } = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/download/:id', protect, downloadImage);
router.get('/user-images', protect, getUserImages);

module.exports = router;