const Image = require('../models/Image');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const { user } = req;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'passport-photo-editor',
    });

    const newImage = new Image({
      user: mongoose.Types.ObjectId(user._id),
      imageUrl: result.secure_url,
    });

    await newImage.save();

    // Crop and compress the image to Canadian passport size
    const croppedImagePath = path.join(__dirname, '..', 'uploads', `${newImage._id}-cropped.jpg`);
    await sharp(file.path)
      .resize(413, 531) // Canadian passport size: 413x531 pixels
      .toFile(croppedImagePath);

    // Compress the image
    const compressedImagePath = path.join(__dirname, '..', 'uploads', `${newImage._id}-compressed.jpg`);
    await sharp(croppedImagePath)
      .jpeg({ quality: 70 }) // Compressing the image to 70% quality
      .toFile(compressedImagePath);

    // Clean up temporary files
    fs.unlinkSync(file.path);
    fs.unlinkSync(croppedImagePath);

    res.status(201).json({
      ...newImage.toObject(),
      compressedImageUrl: `/api/images/download/${newImage._id}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', `${id}-compressed.jpg`);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.download(imagePath, 'passport-photo.jpg', (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      // Clean up the file after download
      fs.unlinkSync(imagePath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserImages = async (req, res) => {
  try {
    const { user } = req;
    const images = await Image.find({ user: user._id });

    res.status(200).json(images);
  } catch (error) {
    res.status (500).json({ error: error.message });
  }
};