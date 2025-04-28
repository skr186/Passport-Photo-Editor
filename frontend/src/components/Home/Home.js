import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/images/user-images', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch images', error);
      }
    };

    if (isAuthenticated) {
      fetchImages();
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login-register');
    } else {
      navigate('/upload');
    }
  };

  const handleDownload = async (imageId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/images/download/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a link element and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'passport-photo.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image', error);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Passport Photo Editor</h1>
        <button className="btn btn-primary" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      {isAuthenticated && (
        <div className="user-images">
          <h2>Your Uploaded Images</h2>
          <div className="image-grid">
            {images.map(image => (
              <div key={image._id} className="image-item">
                <img src={image.imageUrl} alt="Uploaded" />
                <button onClick={() => handleDownload(image._id)}>Download</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;