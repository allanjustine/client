import React, { useState } from 'react';
import smct from '../img/smct.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import bg from '../img/bg.png';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function InputField({ icon, text, value, onChange, errorMessage }) {

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <span className="mr-2 text-gray-400">{icon}</span>
        <input
          type={text === 'Password' ? 'password' : 'text'}
          className={`w-full h-12 px-4 rounded-md border ${errorMessage ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
          placeholder={text}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className='flex items-center'>
        <span className={errorMessage ? 'mr-2 text-gray-400 opacity-0' : 'hidden'}>{icon}</span>
        {errorMessage && (
          <span className="text-red-500">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}

// Component for rendering the login form
function LoginForm({ fields }) {
  const [inputValues, setInputValues] = useState(fields.map(() => ''));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  //eslint-disable-next-line
  const [error, setError] = useState('');

  // Handler for input change
  const handleChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = inputValues[0];
    const password = inputValues[1];
    setLoading(true);

    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.status === 200) {
        setSuccess('Login successful!');
        navigate('/dashboard');
        localStorage.setItem('token', response.data.token);
      } else {
        setLoading(false);
        setError('Login failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 409) {
        localStorage.setItem('token', error.response.data.token);
        navigate('/change-new-password');
      } else if (error.response && error.response.data) {
        setError(error.response.data.message);
        setValidationErrors(error.response.data.errors || {});
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-right',
          iconColor: 'red',
          customClass: {
            popup: 'colored-toast',
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });

        await Toast.fire({
          icon: 'error',
          title: error.response.data.message,
        });
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rounded p-4 w-full max-w-md mt-10" onSubmit={handleSubmit}>
      {fields.map((item, index) => (
        <InputField
          key={index}
          icon={item.icon}
          text={item.text}
          value={inputValues[index]}
          onChange={(event) => handleChange(index, event)}
          errorMessage={validationErrors[item.text.toLowerCase()]}
        />
      ))}
      {success && <div className="text-green-500 mb-2">{success}</div>}

      <div className="flex justify-center flex-col items-center">
        <div className="mb-4">
          <Link to="/forgot" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div>
          <button
            type="submit"
            className="w-32 h-10 mt-8 rounded-full font-semibold bg-blue-800 text-white"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'LOG IN'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Background() {
  return (
    <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: `url(${bg})`, zIndex: -1 }}>
      <div className='absolute inset-0 bg-white opacity-90'></div>
    </div>
  );
}

function LogIn() {
  // Define fields for the login form
  const fields = [
    { icon: <FontAwesomeIcon icon={faEnvelope} />, text: 'Email' },
    { icon: <FontAwesomeIcon icon={faLock} />, text: 'Password' }
  ];

  return (
    <div className='relative min-h-screen'>
      <Background />
      <div className='flex flex-col items-center pt-20' style={{ zIndex: 1 }}>
        <img src={smct} alt="SMCT Logo" className='w-72 h-32 m-0 block'></img>
        <h1 className="text-4xl font-bold mt-5">COMPUTER MONITORING SYSTEM</h1>
        <h1 className="text-4xl font-medium mt-2">Log In</h1>
        <LoginForm fields={fields} />
        <p className='mt-2'>Don't have an account yet? <Link to="/signup" className='text-blue-800'>Sign Up</Link></p>
      </div>
    </div>
  );
}

export default LogIn;

//This is the Log In Form