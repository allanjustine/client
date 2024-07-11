import React, { useState, useEffect, useRef } from "react";
import smct from "../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faRightFromBracket,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import Header from "./Header";
import SideBar from "./Sidebar";

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
    if (!searchTerm) {
      onSelect("");
    }
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user && user.data.branch_code.branch_name) {
      setSearchTerm(user.data.branch_code.branch_name);
    }
  }, [user]);

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

function Placeholder() {
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    branch_code_id: "",
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    newPassword_confirmation: "",
    profile_picture: null,
  });
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInputValues({
          ...inputValues,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          contactNumber: response.data.data.contactNumber,
          branch_code_id: response.data.data.branch_code.id,
          username: response.data.data.username,
          email: response.data.data.email,
          profile_picture: response.data.data.profile_picture,
          oldPassword: "",
          newPassword: "",
          newPassword_confirmation: "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
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

  const options = branches.branches.map((branch) => ({
    label: branch.branch_name,
    value: branch.id,
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setInputValues({ ...inputValues, profile_picture: file });
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const formData = new FormData();
      formData.append("firstName", inputValues.firstName);
      formData.append("lastName", inputValues.lastName);
      formData.append("contactNumber", inputValues.contactNumber);
      formData.append("branch_code_id", inputValues.branch_code_id);
      formData.append("username", inputValues.username);
      formData.append("email", inputValues.email);
      formData.append("oldPassword", inputValues.oldPassword);
      formData.append("newPassword", inputValues.newPassword);
      formData.append(
        "newPassword_confirmation",
        inputValues.newPassword_confirmation
      );
      formData.append("profile_picture", inputValues.profile_picture);
      const response = await axios.post("/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
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
            icon: "success",
            title: response.data.message,
          });
        })();
        setSuccess(response.data.message);
        setError("");
        setValidationErrors("");
        inputValues.oldPassword = "";
        inputValues.newPassword = "";
        inputValues.newPassword_confirmation = "";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const profilePictureUrl = "/profile.png";
  const imageUrl = inputValues.profile_picture
    ? `http://localhost:8000/${inputValues.profile_picture}`
    : profilePictureUrl;
  return (
    <div className="w-full max-w-2xl p-4 mt-10 rounded">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col items-center justify-center w-full mt-4">
          <div className="flex flex-col items-center justify-center p-4 border shadow-xl w-80 h-80 rounded-xl">
            <img
              src={preview ? preview : imageUrl}
              alt="Profile"
              className="w-48 h-48 rounded-full"
            />
            <label htmlFor="upload-button" className="folder">
              <p className="font-normal text-center text-gray-600 bg-gray-100 cursor-pointer hover:bg-gray-300">
                Change Photo
                <FontAwesomeIcon icon={faCamera} className="pl-2" />
              </p>
            </label>
            <input
              id="upload-button"
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="pt-2 text-lg font-semibold text-center">
              {user ? (
                <>
                  {`${user.data.firstName} ${user.data.lastName}`}
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="pl-2 text-blue-500"
                  />
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
        <p className="mt-5 mb-5 text-xl text-center">Profile Information</p>
        <hr />
        <div className="flex items-center mt-5">
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 mr-2 border border-gray-300 rounded-md"
              placeholder="First Name"
              value={inputValues.firstName}
              onChange={(e) =>
                setInputValues({ ...inputValues, firstName: e.target.value })
              }
            />
            <span className="mb-2">
              {validationErrors.firstName && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.firstName.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 ml-2 border border-gray-300 rounded-md"
              placeholder="Last Name"
              value={inputValues.lastName}
              onChange={(e) =>
                setInputValues({ ...inputValues, lastName: e.target.value })
              }
            />
            <span className="mb-2">
              {validationErrors.lastName && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.lastName.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 mr-2 border border-gray-300 rounded-md"
              placeholder="Contact Number"
              value={inputValues.contactNumber}
              onChange={(e) =>
                setInputValues({
                  ...inputValues,
                  contactNumber: e.target.value,
                })
              }
            />
            <span className="mb-2">
              {validationErrors.contactNumber && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.contactNumber.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
          <div className="w-1/2 pr-2">
            <input
              type="email"
              className="w-full h-12 px-4 ml-2 border border-gray-300 rounded-md"
              placeholder="Email"
              value={inputValues.email}
              onChange={(e) =>
                setInputValues({ ...inputValues, email: e.target.value })
              }
            />
            <span className="mb-2">
              {validationErrors.email && (
                <div className="text-red-500">
                  <ul>
                    {validationErrors.email.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
        </div>
        <SearchableDropdown
          options={options}
          name="branch_code_id"
          id="branch_code_id"
          placeholder="Select Branch Code"
          onSelect={(option) =>
            setInputValues({ ...inputValues, branch_code_id: option.value })
          }
        />
        <span className="mb-2">
          {validationErrors.branch_code_id && (
            <div className="text-red-500">
              <ul>
                {validationErrors.branch_code_id.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Username"
            value={inputValues.username}
            onChange={(e) =>
              setInputValues({ ...inputValues, username: e.target.value })
            }
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
        <p className="mt-5 mb-5 text-xl text-center">Change Password</p>
        <hr />
        <div className="flex items-center mt-5">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Old Password"
            value={inputValues.oldPassword}
            onChange={(e) =>
              setInputValues({ ...inputValues, oldPassword: e.target.value })
            }
          />
        </div>
        <span className="mb-2">
          {validationErrors.oldPassword && (
            <div className="text-red-500">
              <ul>
                {validationErrors.oldPassword.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="New Password"
            value={inputValues.newPassword}
            onChange={(e) =>
              setInputValues({ ...inputValues, newPassword: e.target.value })
            }
          />
        </div>{" "}
        <span className="mb-2">
          {validationErrors.newPassword && (
            <div className="text-red-500">
              <ul>
                {validationErrors.newPassword.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Confirm New Password"
            value={inputValues.newPassword_confirmation}
            onChange={(e) =>
              setInputValues({
                ...inputValues,
                newPassword_confirmation: e.target.value,
              })
            }
          />
        </div>
        <span className="mb-2">
          {validationErrors.newPassword_confirmation && (
            <div className="text-red-500">
              <ul>
                {validationErrors.newPassword_confirmation.map(
                  (error, index) => (
                    <li key={index}>{error}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center justify-center">
          <div className="flex gap-2 pb-10">
            <Link to="/dashboard">
              <button className="h-10 mt-10 font-semibold text-white bg-gray-600 w-44 rounded-xl">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={
                loading
                  ? "h-10 mt-10 font-semibold text-white bg-blue-300 w-44 rounded-xl"
                  : "h-10 mt-10 font-semibold text-white bg-blue-600 w-44 rounded-xl"
              }
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Example profile picture URL
  const profilePictureUrl = "/profile.png";

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
          <Placeholder />
        </div>
      </div>
    </div>
  );
};

export default Profile;
