import React, { useState } from "react";
import smct from "../img/smct.png";
import bg from "../img/bg.png";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Placeholder({ texts }) {
  const [inputValues, setInputValues] = useState(texts.map(() => ""));
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("/api/forgot-password", {
        email: inputValues[0],
      });
      if (response.data.status === true) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonColor: "#1e88e5",
          showCloseButton: true,
          confirmButtonText: "Ok",
          html: "You will redirected to Login page <br>Thank you!",
        }).then(function () {
          window.location = "/login";
        });
        setSuccess(response.data.message);
        setError("");
        setValidationErrors("");
      }
      console.log("Password reset email sent!", response.data);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.response && error.response.data) {
        console.log("Backend error response:", error.response.data);
        setError(error.response.data.message);
        setValidationErrors(error.response.data.errors || {});
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          showCloseButton: true,
          confirmButtonColor: "#1e88e5",
          confirmButtonText: "Ok",
        });
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 mt-10 border rounded">
      <form onSubmit={handleSubmit}>
        {texts.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2 text-gray-400">{item.icon}</span>
            <input
              type="text"
              className={
                validationErrors.email
                  ? "w-full h-12 px-4 rounded-md border border-red-500"
                  : "w-full h-12 px-4 rounded-md border border-gray-300"
              }
              placeholder={item.text}
              value={inputValues[index]}
              onChange={(event) => handleChange(index, event)}
            />
          </div>
        ))}
        <div className="flex items-center">
          <span
            className={
              validationErrors ? "mr-2 text-gray-400 opacity-0" : "hidden"
            }
          >
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            {validationErrors.email && (
              <div className="text-red-500">
                {validationErrors.email.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </div>
            )}
          </span>
        </div>

        <div className="flex justify-center mb-10">
          <div className="text-center">
            <button
              className={
                loading
                  ? "mt-10 h-auto rounded-full font-semibold bg-blue-800 text-white"
                  : "mt-10 h-10 rounded-full font-semibold bg-blue-800 text-white"
              }
              style={{ width: "192px" }}
              disabled={loading}
            >
              {loading ? "Generating New Password..." : "GET NEW PASSWORD"}
            </button>
          </div>
        </div>
        <hr />
        <div className="flex justify-center mt-10">
          <Link
            to="/"
            className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Go back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

function Backg() {
  return (
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})`, zIndex: -1 }}
    >
      <div className="absolute inset-0 bg-white opacity-90"></div>
    </div>
  );
}

function Forgot() {
  return (
    <div>
      <Backg />
      <div className="flex flex-col items-center pt-20" style={{ zIndex: 1 }}>
        <img src={smct} alt="SMCT Logo" className="block h-32 m-0 w-72"></img>
        <h1 className="mt-5 text-4xl font-bold">COMPUTER MONITORING SYSTEM</h1>
        <h1 className="mt-2 text-4xl font-medium">Reset Password</h1>
        <Placeholder
          texts={[
            { icon: <FontAwesomeIcon icon={faEnvelope} />, text: "Email" },
          ]}
        />
      </div>
    </div>
  );
}

export default Forgot;
