import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import greenCheckmark from '../../assets/images/green-checkmark.gif'; // Add a green checkmark GIF to your assets
import '../LoginRegister/LoginRegister.css';
const VerifyAccount = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/verify/${token}`);
                if (response.data.message === 'Account verified successfully') {
                    setIsVerified(true);
                }
            } catch (error) {
                setErrorMessage('Verification failed. Please try again.');
            }
        };

        verifyAccount();
    }, [token]);

    const handleButtonClick = () => {
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', minHeight: '70vh' }}>
            {isVerified ? (
                <div>
                    <img src={greenCheckmark} alt="Verified" style={{ width: '500px', height: '500px' }} />
                    <h2>Account Verified Successfully!</h2>
                    <button className='btn btn-primary' onClick={handleButtonClick} >
                        Go to Login/Register
                    </button>
                </div>
            ) : (
                <div>
                    <h2>{errorMessage}</h2>
                </div>
            )}
        </div>
    );
};

export default VerifyAccount;