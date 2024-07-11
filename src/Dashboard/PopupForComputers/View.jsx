import React, { useState, useEffect } from "react";
import smct from "./../../img/smct.png";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Button,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import axios from "../../api/axios";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: "auto",
    width: "100%",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function View({ isOpen, onClose, viewPopupData, setViewPopupData, onSubmit }) {
  const [showAll, setShowAll] = useState(false);
  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationContent, setApplicationContent] = useState([]);
  const [position, setPosition] = useState({ positions: [] });
  const [branchcode, setBranchcode] = useState({ branches: [] });
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [user, setUser] = useState({
    application_content: applicationContent,
    position: viewPopupData.position ? viewPopupData.position.id : null,
    branch_code: viewPopupData.branch_code
      ? viewPopupData.branch_code.id
      : null,
  });
  useEffect(() => {
    setUser({
      application_content: applicationContent,
      branch_code: viewPopupData.branch_code
        ? viewPopupData.branch_code.id
        : null,
      position: viewPopupData.position ? viewPopupData.position.id : null,
    });
  }, [viewPopupData]);

  const handleBranchCodeChange = (event, newValue) => {
    setUser({
      ...user,
      branch_code: newValue ? newValue.id : null,
    });
  };
  const handlePositionChange = (event, newValue) => {
    setUser({
      ...user,
      position: newValue ? newValue.id : null,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApplications = (event, newValue) => {
    event.preventDefault();
    setApplicationContent(newValue);
  };

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

  useEffect(() => {
    if (viewPopupData?.computers) {
      const apps = viewPopupData.computers.flatMap((computer) =>
        computer.installed_applications.map((app) => app.application_content)
      );
      setApplicationContent(apps);
    }
  }, [viewPopupData]);

  useEffect(() => {
    if (viewPopupData?.computers) {
      const specsData = viewPopupData.computers.flatMap((computer) =>
        computer.units.map((unit) => ({
          ...unit,
          computerName: computer.name,
        }))
      );
      setRows(specsData);

      const ids = viewPopupData.computers.map((comp) => comp.id);
      setId(ids);
    }
  }, [viewPopupData]);

  const handleViewMore = () => {
    setShowAll(true);
  };

  if (!isOpen) {
    return null; // Render nothing if isOpen is false
  }

  const fstatus = viewPopupData.computers.map(
    (fstatus) => fstatus.formatted_status
  );

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    onSubmit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.put(
        `api/installed/${id[0]}/computer-user/${viewPopupData.id}`,
        {
          application_content: applicationContent,
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
        const updatedResponse = await axios.get(
          `/api/computer-user-specs/${viewPopupData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setViewPopupData(updatedResponse.data.computer_user_specs);
        handleClose();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
            container: "swalContainer",
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
        setValidationErrors("");
      }
      console.log("Adding computer set:", response.data);
    } catch (error) {
      console.error("Error in adding computer set:", error);
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
            container: "swalContainer",
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
      setLoading(false);
      onSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40">
      <div
        className="bg-white shadow-md rounded-2xl"
        style={{ maxWidth: "100vh", minWidth: "1000px", maxHeight: "100vh" }}
      >
        <div className="flex p-5 bg-blue-500 rounded-tr-2xl rounded-tl-2xl max-h-max">
          <div className="flex-none">
            <img
              src={smct}
              alt="SMCT Logo"
              className="block h-24 m-0 w-60"
            ></img>
          </div>
          <div className="flex-none mt-4 ml-10 text-lg text-justify text-white">
            <p>
              <b>BRANCH CODE: </b>
              {viewPopupData.branch_code.branch_name}
            </p>
            <p>
              <b>NAME OF USER: </b>
              {viewPopupData.name}
            </p>
            <p>
              <b>DESIGNATION: </b>
              {viewPopupData.position.position_name}
            </p>
          </div>
          <div className="flex-1 text-3xl font-medium text-center text-white mt-7">
            <p>Computer ID: {id.length === 1 ? id : "NaN"}</p>
            <p className="text-base">
              Total Format:{" "}
              {fstatus[0] === 0
                ? "No formatting has been applied yet."
                : fstatus}
            </p>
          </div>
          <CloseIcon onClick={onClose} className="text-white cursor-pointer" />
        </div>
        <div
          className="mt-6 mb-4 ml-6 mr-6 overflow-y-scroll text-justify"
          style={{ height: "470px" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow className="bg-blue-300">
                      <TableCell>
                        <Typography
                          align="center"
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          UNIT CODE
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          align="center"
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          CATEGORY
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          align="center"
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          STATUS
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          align="center"
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          RECENT USER
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {unit.unit_code}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {unit.category.category_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {unit.status}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {viewPopupData.name}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* {viewPopupData.computers.flatMap((comp) =>
                      comp.recent_users.map((recent, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {recent.unit.unit_code}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {recent.unit.category.category_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {recent.unit.status}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {recent.computer_user.name}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )} */}
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        <p className="text-center">
                          {rows.length === 0
                            ? "This user has no computer units"
                            : ""}
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow className="bg-red-300">
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          DEVICE INFORMATION
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          DETAILS
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Installed Applications
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(viewPopupData.computers) ? (
                          <div>
                            <ul>
                              {showAll
                                ? viewPopupData.computers.flatMap((item, idx) =>
                                    item.installed_applications.map((item) => (
                                      <li key={idx}>
                                        {item.application_content}
                                      </li>
                                    ))
                                  )
                                : viewPopupData.computers
                                    .slice(0, 3)
                                    .flatMap((item, idx) =>
                                      item.installed_applications.map(
                                        (item) => (
                                          <li key={idx}>
                                            {item.application_content}
                                          </li>
                                        )
                                      )
                                    )}
                            </ul>
                            {viewPopupData.computers.length > 3 && !showAll && (
                              <button onClick={handleViewMore}>
                                <u>View More</u>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span>{viewPopupData.computers}</span>
                        )}
                        <p>
                          {viewPopupData.computers.flatMap((item, idx) =>
                            item.installed_applications.length === 0
                              ? "No installed applications yet."
                              : ""
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Remarks
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(viewPopupData.computers) ? (
                          <div>
                            <ul>
                              {showAll
                                ? viewPopupData.computers.flatMap((item, idx) =>
                                    item.remarks.map((item) => (
                                      <li key={idx}>{item.remark_content}</li>
                                    ))
                                  )
                                : viewPopupData.computers
                                    .slice(0, 3)
                                    .flatMap((item, idx) =>
                                      item.remarks.map((item) => (
                                        <li key={idx}>
                                          <div className="p-2 mb-1 border rounded-lg">
                                            <div>
                                              {format(
                                                new Date(item.date),
                                                "MMMM dd, yyyy"
                                              )}
                                            </div>
                                            {item.remark_content
                                              .split("\n")
                                              .map((line, lineIndex) => (
                                                <div key={lineIndex}>
                                                  {line}
                                                </div>
                                              ))}
                                          </div>
                                        </li>
                                      ))
                                    )}
                            </ul>
                            {viewPopupData.computers.length > 3 && !showAll && (
                              <button onClick={handleViewMore}>
                                <u>View More</u>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span>{viewPopupData.computers}</span>
                        )}
                        <p>
                          {viewPopupData.computers.flatMap((item, idx) =>
                            item.remarks.length === 0 ? "No remarks yet." : ""
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
        <div className="flex items-center justify-center pt-10 pb-10 text-center">
          <button
            className="mr-16 text-xl text-black bg-gray-300 rounded-3xl h-9 w-36"
            onClick={handleClickOpen}
          >
            EDIT
          </button>
          <button className="text-xl text-white bg-blue-500 rounded-3xl h-9 w-36">
            PRINT
          </button>
          <form onSubmit={handleSubmit}>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle
                sx={{ m: 0, p: 2 }}
                id="customized-dialog-title"
                className="text-white bg-blue-500"
              >
                EDIT COMPUTER ID. {id.length === 1 ? id : "NaN"}
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <TextField
                  id="outlined-read-only-input"
                  label="Name of User"
                  defaultValue={viewPopupData.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  style={{ marginBottom: "10px", width: "100%" }}
                />
                <Autocomplete
                  id="branch-code"
                  freeSolo
                  defaultValue={viewPopupData.branch_code.branch_name}
                  readOnly={Branchcode.length === 0}
                  options={Branchcode} //Sample
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
                      style={{ marginBottom: "10px" }}
                    />
                  )}
                  value={
                    Branchcode.find(
                      (option) => option.id === user.branch_code
                    ) || {}
                  }
                  onChange={handleBranchCodeChange}
                />
                {validationErrors.branch_code ? (
                  <span className="text-red-500">
                    {validationErrors.branch_code.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
                <Autocomplete
                  id="designation"
                  freeSolo
                  defaultValue={viewPopupData.position.position_name}
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
                      style={{ marginBottom: "10px" }}
                    />
                  )}
                  value={
                    Position.find((option) => option.id === user.position) || {}
                  }
                  onChange={handlePositionChange}
                />
                {validationErrors.position ? (
                  <span className="text-red-500">
                    {validationErrors.position.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={[
                    "Adobe",
                    "Office",
                    "Chrome",
                    "Firefox",
                    "Visual Studio",
                  ]}
                  freeSolo
                  value={applicationContent}
                  onChange={handleApplications}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Installed Applications"
                      placeholder="Installed Applications"
                    />
                  )}
                />
                {validationErrors.application_content ? (
                  <span className="text-red-500">
                    {validationErrors.application_content.map(
                      (error, index) => (
                        <span key={index}>{error}</span>
                      )
                    )}
                  </span>
                ) : (
                  ""
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                  style={{ margin: "10px" }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </form>
        </div>
      </div>
    </div>
  );
}

export default View;
