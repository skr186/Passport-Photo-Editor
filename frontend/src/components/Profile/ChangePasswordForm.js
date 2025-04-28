import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import authService from '../../services/authService';
import './ChangePasswordForm.css';

const changePasswordValidationSchema = yup.object({
  oldPassword: yup.string().required('Old Password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function ChangePasswordForm({ onSuccess, onError }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccess('');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const payload = {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        };
        await authService.updateProfile(user.token, payload);
        setSuccess('Password changed successfully');
        if (onSuccess) onSuccess('Password changed successfully');
      } catch (error) {
        const errorMessage = error.response && error.response.data.message === 'Old password is incorrect'
          ? 'Old password is incorrect'
          : 'Password change failed';
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    },
  });

  return (
    <div className="change-password-form">
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            className="form-control"
            {...formik.getFieldProps('oldPassword')}
          />
          {formik.touched.oldPassword && formik.errors.oldPassword ? (
            <div className="error-text">{formik.errors.oldPassword}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            {...formik.getFieldProps('newPassword')}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="error-text">{formik.errors.newPassword}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            {...formik.getFieldProps('confirmPassword')}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error-text">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <button className="btn btn-primary" type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;