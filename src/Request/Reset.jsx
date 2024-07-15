import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import smct from '../img/smct.png';
import bg from '../img/bg.png';
import { InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../api/axios';
import Swal from 'sweetalert2';

function Backg() {
  return (
    <div className='absolute inset-0 bg-center bg-cover' style={{ backgroundImage: `url(${bg})`, zIndex: -1 }}>
      <div className='absolute inset-0 bg-white opacity-90'></div>
    </div>
  );
}

function Reset() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    new_password: '',
    new_password_confirmation: '',
  });
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirm = () => setShowConfirm((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoading(true);

    try {
      const userId = user ? user.id : null;
      const response = await axios.put(`/api/change-new-password/${userId}`, inputValues);
      if (response.data.status === true) {
        Swal.fire({
          icon: 'success',
          title: response.data.message,
          confirmButtonColor: '#1e88e5',
          showCloseButton: true,
          confirmButtonText: 'Ok',
          html: "You will redirected to Dashboard <br>Thank you!"
        }).then(function () {
          window.location = "/dashboard";
        });
      }
      console.log('Password reset successful: ', response.data);
      setInputValues({
        new_password: '',
        new_password_confirmation: '',
      });
      setError('');
      setValidationErrors('');
    } catch (error) {
      console.error('Error resetting password: ', error);
      setError(error.response.data.message);
      setValidationErrors(error.response.data.errors || {});
      Swal.fire({
        icon: 'error',
        title: error.response.data.message,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Ok',
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
    setError(null);
  };

  return (
    <div>
      <Backg />
      <div className='flex flex-col items-center pt-20' style={{ zIndex: 1 }}>
        <img src={smct} alt="SMCT Logo" className='block h-32 m-0 w-72'></img>
        <h1 className="mt-5 text-xl font-bold md:text-4xl">COMPUTER MONITORING SYSTEM</h1>
        <h1 className="mt-2 mb-10 text-4xl font-medium">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={inputValues.new_password}
              onChange={handleChange}
              name="new_password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              error={!!validationErrors.new_password}
              sx={{ borderColor: validationErrors.new_password ? 'red' : '#ccc' }}
              label="New Password"
            />
            <span className='mb-2'>
              {validationErrors.new_password && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.new_password.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </FormControl> <br />
          <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-confirm">Confirm New Password</InputLabel>
            <OutlinedInput
              id='outlined-adornment-confirm'
              type={showConfirm ? 'text' : 'password'}
              name="new_password_confirmation"
              value={inputValues.new_password_confirmation}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowConfirm}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              error={!!validationErrors.new_password}
              sx={{ borderColor: validationErrors.new_password ? 'red' : '#ccc' }}
              label="New Confirm Password"
            />
            <span className='mb-2'>
              {validationErrors.new_password_confirmation && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.new_password_confirmation.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </FormControl> <br />
          <div className='ml-5 text-sm text-red-500'>
            {error && <div className="text-green-500">{error}</div>}
          </div>
          <div className='flex justify-center'>
            <button type="submit" className='h-10 mt-5 font-semibold text-white bg-blue-800 rounded-full' disabled={loading} style={{ width: '192px' }}>{loading ? 'Please Wait...' : 'RESET PASSWORD'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reset;
