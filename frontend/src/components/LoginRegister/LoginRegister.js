import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { setUser } from '../../redux/slices/userSlice';
import authService from '../../services/authService';
import './LoginRegister.css';

const loginValidationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const registerValidationSchema = yup.object({
  name: yup.string()
  .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const forgotPasswordValidationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formikLogin = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccessMessage('');
      try {
        const response = await authService.login(values);
        sessionStorage.setItem('token', response.token);
        dispatch(setUser({ user: response.user, token: response.token }));
        navigate('/profile');
      } catch (error) {
        setError('Invalid email or password');
      }
    },
  });

  const formikRegister = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccessMessage('');
      try {
        const response = await authService.register(values);
        console.log(response);
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
        setIsLogin(true);
      } catch (error) {
        setError('Registration failed');
      }
    },
  });

  const formikForgotPassword = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccessMessage('');
      try {
        await authService.forgotPassword(values.email);
        setSuccessMessage('Password reset link has been sent to your email.');
        setIsForgotPassword(false);
      } catch (error) {
        setError('Failed to send password reset link');
      }
    },
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError('');
    setSuccessMessage('');
  };

  return (
    <motion.div
      className="login-register-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isForgotPassword ? (
        <form className="forgot-password-form" onSubmit={formikForgotPassword.handleSubmit}>
          <h1>Forgot Password</h1>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            {...formikForgotPassword.getFieldProps('email')}
          />
          {formikForgotPassword.touched.email && formikForgotPassword.errors.email ? (
            <div className="error-text">{formikForgotPassword.errors.email}</div>
          ) : null}
          <button className="btn btn-primary" type="submit">Send Reset Link</button>
          <p className="toggle-form-text">Remembered your password? <span onClick={toggleForgotPassword}>Login</span></p>
        </form>
      ) : isLogin ? (
        <form className="login-form" onSubmit={formikLogin.handleSubmit}>
          <h1>Login</h1>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            {...formikLogin.getFieldProps('email')}
          />
          {formikLogin.touched.email && formikLogin.errors.email ? (
            <div className="error-text">{formikLogin.errors.email}</div>
          ) : null}
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...formikLogin.getFieldProps('password')}
          />
          {formikLogin.touched.password && formikLogin.errors.password ? (
            <div className="error-text">{formikLogin.errors.password}</div>
          ) : null}
          <button className="btn btn-primary" type="submit">Login</button>
          <p className="toggle-form-text">Don't have an account? <span onClick={toggleForm}>Register</span></p>
          <p className="forgot-password" onClick={toggleForgotPassword}>Forgot Password?</p>
        </form>
      ) : (
        <form className="register-form" onSubmit={formikRegister.handleSubmit}>
          <h1>Register</h1>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            {...formikRegister.getFieldProps('name')}
          />
          {formikRegister.touched.name && formikRegister.errors.name ? (
            <div className="error-text">{formikRegister.errors.name}</div>
          ) : null}
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            {...formikRegister.getFieldProps('email')}
          />
          {formikRegister.touched.email && formikRegister.errors.email ? (
            <div className="error-text">{formikRegister.errors.email}</div>
          ) : null}
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...formikRegister.getFieldProps('password')}
          />
          {formikRegister.touched.password && formikRegister.errors.password ? (
            <div className="error-text">{formikRegister.errors.password}</div>
          ) : null}
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            {...formikRegister.getFieldProps('confirmPassword')}
          />
          {formikRegister.touched.confirmPassword && formikRegister.errors.confirmPassword ? (
            <div className="error-text">{formikRegister.errors.confirmPassword}</div>
          ) : null}
          <button className="btn btn-primary" type="submit">Register</button>
          <p className="toggle-form-text">Already have an account? <span onClick={toggleForm}>Login</span></p>
        </form>
      )}
    </motion.div>
  );
}

export default LoginRegister;