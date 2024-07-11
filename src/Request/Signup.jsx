import React, { useState, useEffect, useRef } from "react";
import smct from "../img/smct.png";
import bg from "../img/bg.png";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";

//This is for the Searchable Dropdown

const SearchableDropdown = ({ options, placeholder, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center mt-4">
      <input
        type="text"
        className="w-full h-12 px-4 border border-gray-300 rounded-md"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && (
        <ul className="absolute z-20 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md top-full max-h-60">
          {Array.isArray(filteredOptions) && filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 cursor-default">
              No branches found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

// END OF THE SEARCHABLE DROPDOWN

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

function SignUp() {
  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    branchCode: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [branches, setBranches] = useState({ branches: [] });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("/api/branch-code");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const options = branches.branches.map((branch) => ({
    label: branch.branch_name,
    value: branch.id,
  }));

  const handleChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/register", inputValues);
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
        setInputValues({
          firstName: "",
          lastName: "",
          contactNumber: "",
          branchCode: "",
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
        // navigate('/')
      }
    } catch (error) {
      console.error("Error: ", error);
      setSuccess("");
      if (error.response && error.response.data) {
        console.log("Backend error response:", error.response.data);
        setError(error.response.data.message);
        setValidationErrors(error.response.data.errors || {});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Backg />
      <div className="flex flex-col items-center pt-20" style={{ zIndex: 1 }}>
        <img src={smct} alt="SMCT Logo" className="block h-32 m-0 w-72"></img>
        <h1 className="mt-5 text-4xl font-bold">COMPUTER MONITORING SYSTEM</h1>
        <h1 className="mt-2 text-4xl font-medium">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="w-full max-w-2xl p-4 mt-10 rounded">
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="col-span-1">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className={
                    validationErrors.firstName
                      ? " w-full h-12 px-4 rounded-md border mr-2 border-red-500"
                      : " w-full h-12 px-4 rounded-md border border-gray-300 mr-2"
                  }
                  placeholder="First Name"
                  value={inputValues.firstName}
                  onChange={handleChange}
                />
                <span className="text-sm">
                  {validationErrors.firstName && (
                    <div className="text-red-500">
                      {validationErrors.firstName.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className={
                    validationErrors.lastName
                      ? "w-full h-12 px-4 rounded-md border mr-2 border-red-500"
                      : "w-full h-12 px-4 rounded-md border border-gray-300 mr-2"
                  }
                  placeholder="Last Name"
                  value={inputValues.lastName}
                  onChange={handleChange}
                />
                <span className="text-sm">
                  {validationErrors.lastName && (
                    <div className="text-red-500">
                      {validationErrors.lastName.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="col-span-1">
                <input
                  type="text"
                  name="contactNumber"
                  id="contactNumber"
                  className={
                    validationErrors.contactNumber
                      ? "w-full h-12 px-4 rounded-md bordermr-2 border-red-500"
                      : "w-full h-12 px-4 rounded-md border border-gray-300 mr-2"
                  }
                  placeholder="Contact Number"
                  value={inputValues.contactNumber}
                  onChange={handleChange}
                />
                <span className="flex text-sm">
                  {validationErrors.contactNumber && (
                    <div className="text-red-500">
                      {validationErrors.contactNumber.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className={
                    validationErrors.email
                      ? "w-full h-12 px-4 rounded-md border mr-2 border-red-500"
                      : "w-full h-12 px-4 rounded-md border border-gray-300 mr-2"
                  }
                  placeholder="Email"
                  value={inputValues.email}
                  onChange={handleChange}
                />
                <span className="text-sm">
                  {validationErrors.email && (
                    <div className="text-red-500">
                      {validationErrors.email.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
              </div>
            </div>
            <SearchableDropdown
              options={options}
              name="branchCode"
              id="branchCode"
              placeholder="Select Branch Code"
              onSelect={(option) =>
                setInputValues({ ...inputValues, branchCode: option.value })
              }
            />
            <span className="mb-2">
              {validationErrors.branchCode && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.branchCode.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
            <div className="flex items-center mt-4">
              <input
                type="text"
                name="username"
                id="username"
                className={
                  validationErrors.username
                    ? "w-full h-12 px-4 rounded-md border border-red-500"
                    : "w-full h-12 px-4 rounded-md border border-gray-300"
                }
                placeholder="Username"
                value={inputValues.username}
                onChange={handleChange}
              />
            </div>
            <span className="mb-2">
              {validationErrors.username && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.username.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
            <div className="flex items-center mt-4">
              <input
                type="password"
                name="password"
                id="password"
                className={
                  validationErrors.password
                    ? "w-full h-12 px-4 rounded-md border border-red-500"
                    : "w-full h-12 px-4 rounded-md border border-gray-300"
                }
                placeholder="Password"
                value={inputValues.password}
                onChange={handleChange}
              />
            </div>
            <span className="mb-2">
              {validationErrors.password && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.password.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
            <div className="flex items-center mt-4">
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                className={
                  validationErrors.password_confirmation
                    ? "w-full h-12 px-4 rounded-md border border-red-500"
                    : "w-full h-12 px-4 rounded-md border border-gray-300"
                }
                placeholder="Confirm Password"
                value={inputValues.password_confirmation}
                onChange={handleChange}
              />
            </div>
            <span className="mb-2">
              {validationErrors.password_confirmation && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.password_confirmation.map(
                      (error, index) => (
                        <li key={index}>{error}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </span>
          </div>
          <div className="text-center">
            {success && <div className="text-green-500">{success}</div>}

            <button
              type="submit"
              className="w-32 h-10 mt-10 font-semibold text-white bg-blue-800 rounded-full"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </div>
        </form>
        <p className="mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-800">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
