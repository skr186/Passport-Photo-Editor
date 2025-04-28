import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as yup from 'yup';
import authService from '../../services/authService';
import ChangePasswordForm from './ChangePasswordForm';
import './Profile.css';

const profileValidationSchema = yup.object({
  name: yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
  .required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
});

function Profile() {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await authService.getProfile(user.token);
        setProfile(response);
        setUpdatedProfile({ name: response.name, email: response.email });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const formik = useFormik({
    initialValues: { name: '', email: '' },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccess('');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await authService.updateProfile(user.token, { name: values.name, email: values.email });
        setSuccess('Profile updated successfully');
      } catch (error) {
        setError('Profile update failed');
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: profile.name || '',
      email: profile.email || '',
    });
  }, [profile]);

  const handlePasswordChangeSuccess = (message) => {
    setSuccess(message);
    setShowChangePasswordForm(false);
  };

  const handlePasswordChangeError = (message) => {
    setError(message);
  };

  return (
    <motion.section
      className="profile-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Account Page</h1>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form className="profile-form" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-text">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            {...formik.getFieldProps('email')}
            disabled
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-text">{formik.errors.email}</div>
          ) : null}
        </div>
        <button className="btn btn-primary" type="submit">Update Profile</button>
      </form>
      <button
        className="btn btn-secondary"
        onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
      >
        {showChangePasswordForm ? 'Cancel' : 'Change Password'}
      </button>
      {showChangePasswordForm && (
        <ChangePasswordForm
          onSuccess={handlePasswordChangeSuccess}
          onError={handlePasswordChangeError}
        />
      )}
    </motion.section>
  );
}

export default Profile;