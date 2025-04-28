import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister/LoginRegister';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';


import Profile from './components/Profile/Profile'; 
import ImageUpload from './components/ImageUpload/ImageUpload';
import VerifyAccount from './components/VerifyAccount/VerifyAccount';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Donation from './components/Donation/Donation';
import ImageSizer from './components/ImageSizer/ImageSizer'; 
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/login" element={<LoginRegister/>} />
     
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<ImageUpload/>} />
        <Route path="/verify/:token" element={<VerifyAccount/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/resizer/:imageId" element={<ImageSizer />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;