import React from 'react';
import './Donation.css';

function Donation() {
  const handleDonation = () => {
    window.location.href = 'https://buy.stripe.com/test_14kg0X5WO0MC97q9AA';
  };

  return (
    <div className="donation-container">
      <h2>🌟 Support Our Cause 🌟</h2>
      <p>Your generosity helps us grow and improve. Every donation makes a difference!</p>
      <button onClick={handleDonation} className="donate-button">
        ❤️ Donate Now
      </button>
    </div>
  );
}

export default Donation;
