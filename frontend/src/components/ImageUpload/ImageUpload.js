import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ImageUpload.css';
import ImageSizer from '../ImageSizer/ImageSizer';  // Import ImageSizer component

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sizes, setSizes] = useState({ picWidth: 200, picHeight: 200 }); // Add sizes state

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const onFileUpload = async () => {
    if (!isLoggedIn) {
      setMessage('⚠️ Please log in to upload an image.');
      return;
    }

    if (!selectedFile) {
      setMessage('❌ Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setProcessedImageUrl(`http://localhost:5000${response.data.compressedImageUrl}`);
      setMessage('✅ Image uploaded and processed successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || '❌ Upload failed. Please try again.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.setAttribute('download', 'processed-image.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processImage = (dataUrl) => {
    console.log('Processed Image URL:', dataUrl);  // Add logging for debugging
    if (dataUrl) {
      setProcessedImageUrl(dataUrl);
    } else {
      setMessage('❌ Image processing failed. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <p>Drag & Drop your image here or click to select</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <button onClick={onFileUpload} className="upload-button">
        Upload To Cloud
      </button>
      {message && <p className="message">{message}</p>}

      {preview && (
        <div>
          <h2>Step 2: Crop and position</h2>
          <ImageSizer
            sizes={sizes}
            sourceImage={preview}
            processImage={processImage}
            isProcessing={false}
          />
        </div>
      )}

      {processedImageUrl && (
        <div className="processed-image-preview">
          <h2>Processed Image</h2>
          <img src={processedImageUrl} alt="Processed" />
          <button className="upload-button" onClick={handleDownload}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;