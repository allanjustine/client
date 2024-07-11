import React, { useState, useEffect } from "react";
import SideBar from "../Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import Header from "../../Dashboard/Header";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

function User() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [position_name, setPositionName] = useState("");
  const [branch_name, setBranchName] = useState("");
  const [position, setPosition] = useState({ positions: [] });
  const [branchcode, setBranchcode] = useState({ branches: [] });
  const [ploading, setpLoading] = useState(false);
  const [bloading, setbLoading] = useState(false);
  const [uloading, setuLoading] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState("");
  const [user, setUser] = useState({
    name: "",
    position: "",
    branch_code: "",
  });

  useEffect(() => {
    const fetchBrancheCode = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/branches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBranchcode(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchBrancheCode();
  }, [branchcode]);
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/positions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosition(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchPosition();
  }, [position]);

  // This is a sample data for Position
  const Position =
    position.positions && position.positions.length > 0
      ? position.positions.map((pos) => ({
          id: pos.id,
          position_name: pos.position_name,
        }))
      : [];

  // This is a sample data for Branchcode
  const Branchcode =
    branchcode.branches && branchcode.branches.length > 0
      ? branchcode.branches.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }))
      : [];

  const handleSubmitUser = async (event) => {
    event.preventDefault();
    setuLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        "api/add-computer-user",
        {
          name: user.name,
          position: user.position,
          branch_code: user.branch_code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        setUser({
          name: "",
          position: "",
          branch_code: "",
        });
        setError("");
        setValidationErrors("");
      }
      console.log("Adding user:", response.data);
    } catch (error) {
      console.error("Error in adding user:", error);
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
        console.log("ERROR!");
      }
    } finally {
      setuLoading(false);
    }
  };

  const handleSubmitPosition = async (event) => {
    event.preventDefault();
    setpLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        "api/add-position",
        {
          position_name: position_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        setPositionName("");
        setError("");
        setValidationErrors("");
      }
      console.log("Adding position:", response.data);
    } catch (error) {
      console.error("Error in adding position:", error);
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
        console.log("ERROR!");
      }
    } finally {
      setpLoading(false);
    }
  };

  const handleSubmitBranchCode = async (event) => {
    event.preventDefault();
    setbLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        "api/add-branch",
        {
          branch_name: branch_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        setBranchName("");
        setError("");
        setValidationErrors("");
      }
      console.log("Adding branch code:", response.data);
    } catch (error) {
      console.error("Error in adding branch code:", error);
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
        console.log("ERROR!");
      }
    } finally {
      setbLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", flex: 1 }}>
        <div>
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div style={{ flex: 2, paddingBottom: "50px" }}>
          <p className="pt-10 ml-10 text-2xl font-normal">
            Setup Computer User
          </p>
          <div className="mt-2 ml-10">
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                path
                to="/dashboard"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
              >
                <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Setup
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <GroupAddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Setup Users
              </Typography>
            </Breadcrumbs>
          </div>
          <br /> <br />
          <div className="flex items-center justify-center ml-10 mr-10">
            <div className="w-1/2 mr-5 border border-transparent shadow-lg rounded-xl max-h-max">
              <form onSubmit={handleSubmitPosition}>
                <div className="flex items-center justify-center text-center">
                  <div className="w-full h-10 bg-red-200 rounded-tl-xl rounded-tr-xl">
                    <p className="font-semibold text-base mt-1.5">
                      ADD NEW POSITION
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-5 pb-4 pl-5 pr-5">
                  <input
                    type="text"
                    value={position_name}
                    onChange={(e) => setPositionName(e.target.value)}
                    placeholder="Input position..."
                    className={
                      validationErrors.position_name
                        ? "bg-gray-200 border border-red-500 rounded-xl w-3/4 h-9 pl-5"
                        : "bg-gray-200 border border-transparent rounded-xl w-3/4 h-9 pl-5"
                    }
                  />
                </div>
                <span>
                  {validationErrors.position_name && (
                    <div className="text-center text-red-500">
                      {validationErrors.position_name.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={ploading}
                    className="w-32 mb-5 text-base font-semibold text-white duration-700 bg-green-600 border border-transparent hover:bg-green-700 rounded-3xl h-9"
                  >
                    {ploading ? "ADDING..." : "ADD"}
                  </button>
                </div>
              </form>
            </div>
            <div className="w-1/2 border border-transparent shadow-lg rounded-xl max-h-max">
              <form onSubmit={handleSubmitBranchCode}>
                <div className="flex items-center justify-center text-center">
                  <div className="w-full h-10 bg-red-200 rounded-tl-xl rounded-tr-xl">
                    <p className="font-semibold text-base mt-1.5">
                      ADD NEW BRANCH CODE
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-5 pb-4 pl-5 pr-5">
                  <input
                    type="text"
                    value={branch_name}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Input branch code..."
                    className={
                      validationErrors.branch_name
                        ? "bg-gray-200 border border-red-500 rounded-xl w-3/4 h-9 pl-5"
                        : "bg-gray-200 border border-transparent rounded-xl w-3/4 h-9 pl-5"
                    }
                  />
                </div>
                <span>
                  {validationErrors.branch_name && (
                    <div className="text-center text-red-500">
                      {validationErrors.branch_name.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}
                    </div>
                  )}
                </span>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={bloading}
                    className="w-32 mb-5 text-base font-semibold text-white duration-700 bg-green-600 border border-transparent hover:bg-green-700 rounded-3xl h-9"
                  >
                    {bloading ? "ADDING..." : "ADD"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex-none mt-10">
            <Container>
              <form onSubmit={handleSubmitUser}>
                <Card>
                  <h2 className="flex items-center justify-center p-5 text-2xl font-semibold bg-blue-200">
                    SET UP USERS
                  </h2>
                  <CardContent>
                    <Grid
                      container
                      className="flex p-5 text-center"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <TextField
                          value={user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          id="name-user"
                          label="Name"
                          variant="standard"
                          style={{ marginRight: "20px", width: "300px" }}
                        />

                        <span>
                          {validationErrors.name && (
                            <div className="text-center text-red-500">
                              {validationErrors.name.map((error, index) => (
                                <span key={index}>{error}</span>
                              ))}
                            </div>
                          )}
                        </span>
                      </Grid>
                      <Grid item>
                        <Autocomplete
                          freeSolo
                          id="position-user"
                          disableClearable
                          options={Position}
                          readOnly={Position.length === 0}
                          getOptionLabel={(option) =>
                            option.position_name ? option.position_name : ""
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                Position.length === 0
                                  ? "No position added yet"
                                  : "Position"
                              }
                              variant="standard"
                              style={{ marginRight: "20px", width: "300px" }}
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                          value={
                            Position.find(
                              (option) => option.id === user.position
                            ) || {}
                          }
                          onChange={(event, newValue) => {
                            setUser({ ...user, position: newValue.id });
                          }}
                        />

                        <span>
                          {validationErrors.position && (
                            <div className="text-center text-red-500">
                              {validationErrors.position.map((error, index) => (
                                <span key={index}>{error}</span>
                              ))}
                            </div>
                          )}
                        </span>
                      </Grid>

                      <Grid item>
                        <Autocomplete
                          freeSolo
                          id="branch_code-user"
                          disableClearable
                          readOnly={Branchcode.length === 0}
                          options={Branchcode}
                          getOptionLabel={(option) =>
                            option.branch_name ? option.branch_name : ""
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                Branchcode.length === 0
                                  ? "No branchcode added yet"
                                  : "Branchcode"
                              }
                              variant="standard"
                              style={{ marginRight: "20px", width: "300px" }}
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                          value={
                            Branchcode.find(
                              (option) => option.id === user.branch_code
                            ) || {}
                          }
                          onChange={(event, newValue) => {
                            setUser({ ...user, branch_code: newValue.id });
                          }}
                        />

                        <span>
                          {validationErrors.branch_code && (
                            <div className="text-center text-red-500">
                              {validationErrors.branch_code.map(
                                (error, index) => (
                                  <span key={index}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                        </span>
                      </Grid>
                      <Grid item>
                        <Button
                          type="submit"
                          disabled={uloading}
                          variant="contained"
                          style={{
                            marginTop: "20px",
                            width: "300px",
                            fontWeight: "550",
                            borderRadius: "100px",
                            fontSize: "16px",
                            backgroundColor: "green",
                          }}
                        >
                          {uloading ? "ADDING..." : "ADD"}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </form>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
