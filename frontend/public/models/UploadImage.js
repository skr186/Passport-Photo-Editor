import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../redux/slices/userSlice';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import * as faceapi from 'face-api.js';
// import './UploadImage.css';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 4 / 3 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Fetch user data from the backend using the token and update the Redux state
      fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setUser({ user: data, token }));
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const imageDataUrl = URL.createObjectURL(file);
    setImage(imageDataUrl);
    const img = await faceapi.bufferToImage(file);
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
    setIsFaceDetected(detections.length > 0);
  };

  const handleCropComplete = (crop) => {
    // Implement cropping logic here
    // Example: Create a cropped version of the image and save to the state
  };

  const handleUpload = async () => {
    if (!user) {
      navigate('/login-register');
      return;
    }

    if (!isFaceDetected) {
      alert('No face detected in the image. Please upload a valid image.');
      return;
    }

    // Implement the image upload logic here
    // Example: Upload the cropped image to the server and save to the database
    const formData = new FormData();
    formData.append('image', croppedImage);

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Image uploaded:', data);
    } else {
      console.error('Error uploading image:', data.error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <ReactCrop
          src={image}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={handleCropComplete}
        />
      )}
      <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadImage;