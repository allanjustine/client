import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import { format } from "date-fns";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

function EditSet({
  isOpen,
  onClose,
  row,
  editPopupData,
  setEditPopupData,
  onSubmit,
}) {
  const [computerUser, setComputerUser] = useState({ data: [] });
  const [computer, setComputer] = useState({
    computer_user: "",
  });
  const [loading, setLoading] = useState(true);
  const [computerName, setComputerName] = useState("");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [transferDate, setTransferDate] = useState(null);
  const [sloading, setsLoading] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [computerId, setComputerId] = useState("");
  const [unit, setUnit] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxClick = (unitId) => {
    if (checkedRows.includes(unitId)) {
      setCheckedRows(checkedRows.filter((id) => id !== unitId));
    } else {
      setCheckedRows([...checkedRows, unitId]);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      if (Array.isArray(editPopupData.computers)) {
        const allUnits = editPopupData.computers.flatMap((computer) =>
          computer.units.map((unit) => ({
            ...unit,
            computerName: computer.name,
          }))
        );
        setUnit(allUnits);
        const name = editPopupData.name;
        const id = editPopupData.computers.map((computer) => computer.id);
        setComputerName(name);
        setComputerId(id);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const fetchComputerUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/computer-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComputerUser(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchComputerUser();
  }, [computerUser]);
  const ComputerUser =
    computerUser.data && computerUser.data.length > 0
      ? computerUser.data
          .filter((cu) => cu.id !== editPopupData.id)
          .map((cu) => ({
            id: cu.id,
            name: cu.name,
          }))
      : [];
  if (!isOpen) {
    return null;
  }
  const handleSubmitEditedSet = async (e) => {
    e.preventDefault();
    setsLoading(true);
    onSubmit(true);
    setRefresh(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      let transferCount = 0;
      let defectiveCount = 0;
      let deleteCount = 0;

      let allSuccess = true;
      const successMessages = [];

      for (const unitId of checkedRows) {
        const response = await axios.post(
          `/api/computer/${computerId}/unit/${unitId}/action`,
          {
            action: reason,
            computer_user: computer.computer_user,
            date: transferDate || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status !== true) {
          allSuccess = false;
          console.log("Operation failed for unit:", unitId);
        } else {
          switch (reason) {
            case "Transfer":
              transferCount++;
              successMessages.push(`Transferred unit ${unitId}`);
              break;
            case "Defective":
              defectiveCount++;
              successMessages.push(`Marked unit ${unitId} as defective`);
              break;
            case "Delete":
              deleteCount++;
              successMessages.push(`Deleted unit ${unitId}`);
              break;
            default:
              break;
          }
        }

        console.log("Processed unit:", unitId, response.data);
      }

      if (allSuccess && successMessages.length > 0) {
        const updatedResponse = await axios.get(
          `/api/computer-user-edit/${editPopupData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditPopupData(updatedResponse.data.computer_user_data);
        setCheckedRows([]);
        setTransferDate(null);
        setReason("");
        setComputer([]);
        if (updatedResponse.data.computer_user_data.computers.length === 0) {
          onClose();
        } else {
          setOpen(false);
        }
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
          timer: 3000,
          timerProgressBar: true,
        });

        await Toast.fire({
          icon: "success",
          title: `Successfully processed: ${successMessages.length} unit(s)`,
          html: `
            <ul>
              ${
                transferCount > 0 ? `<li>${transferCount} transferred</li>` : ""
              }
              ${
                defectiveCount > 0
                  ? `<li>${defectiveCount} marked defective</li>`
                  : ""
              }
              ${deleteCount > 0 ? `<li>${deleteCount} deleted</li>` : ""}
            </ul>
          `,
        });
      }
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

        await Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      } else {
        console.log("ERROR!");
      }
    } finally {
      setsLoading(false);
      setRefresh(false);
      onSubmit(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40">
        <div
          className="bg-white shadow-md rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-xl"
          style={{ minWidth: "1000px", maxWidth: "100vh", maxHeight: "100vh" }}
        >
          <div className="max-h-screen overflow-y-auto text-justify">
            <TableContainer
              component={Paper}
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow className="bg-red-200">
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        UNIT CODE
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        DATE OF PURCHASE
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        CATEGORY
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        DESCRIPTION
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        SUPPLIER
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        SERIAL NO.
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        STATUS
                      </Typography>
                    </TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-full p-4 rounded">
                            <div className="flex space-x-4 animate-pulse">
                              <div className="flex-1 py-1 space-y-6">
                                <div className="h-10 bg-gray-200 rounded shadow"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ) : (
                    unit.map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{unit.unit_code}</TableCell>
                        <TableCell align="center">
                          {format(
                            new Date(unit.date_of_purchase),
                            "yyyy-MM-dd"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {unit.category.category_name}
                        </TableCell>
                        <TableCell align="center">{unit.description}</TableCell>
                        <TableCell align="center">
                          {unit.supplier.supplier_name}
                        </TableCell>
                        <TableCell align="center">
                          {unit.serial_number}
                        </TableCell>
                        <TableCell align="center">{unit.status}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={checkedRows.includes(unit.id)}
                            onChange={() => handleCheckboxClick(unit.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex items-center justify-center">
              <p className="p-5 text-xl text-center">
                <strong>{computerName}&apos;s</strong> Computer Units
              </p>
              <div className="items-end justify-end flex-1 ml-48 text-center">
                <button
                  type="button"
                  className="w-24 h-8 text-sm font-semibold bg-gray-200 rounded-full"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleOpen}
                  className={
                    checkedRows.length === 0
                      ? "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-300 rounded-full cursor-not-allowed"
                      : "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-600 rounded-full"
                  }
                  disabled={checkedRows.length === 0}
                >
                  {checkedRows.length === 0 ? "UPDATE" : "UPDATE"}
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmitEditedSet}>
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Why did you update this unit?
                      </Typography>
                      <Box sx={{ minWidth: 120, marginTop: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            State the reason for the action...
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reason}
                            label="State the reason for the action..."
                            onChange={(e) => {
                              setReason(e.target.value);
                              setValidationErrors("");
                            }}
                          >
                            <MenuItem value="Transfer">Transfer</MenuItem>
                            <MenuItem value="Defective">Defective</MenuItem>
                            <MenuItem value="Delete">Delete</MenuItem>
                          </Select>
                        </FormControl>
                        <span className="mb-2">
                          {validationErrors.action && (
                            <div className="text-red-500">
                              <ul>
                                {validationErrors.action.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </span>
                      </Box>
                      {reason === "Transfer" && (
                        <Box style={{ marginTop: "10px" }}>
                          <Autocomplete
                            freeSolo
                            id="user"
                            disableClearable
                            options={ComputerUser}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            readOnly={ComputerUser.length === 0}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  ComputerUser.length === 0
                                    ? "No user to select"
                                    : "Assign New User"
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  type: "search",
                                }}
                                variant="outlined"
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  marginRight: "400px",
                                }}
                                sx={{ minWidth: 120 }}
                              />
                            )}
                            value={
                              ComputerUser.find(
                                (option) => option.id === computer.computer_user
                              ) || {}
                            }
                            onChange={(event, newValue) => {
                              setComputer({
                                ...computer,
                                computer_user: newValue.id,
                              });
                            }}
                          />
                          <span className="mb-2">
                            {validationErrors.computer_user && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.computer_user.map(
                                    (error, index) => (
                                      <li key={index}>{error}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                label="Date of Transfer"
                                value={transferDate}
                                onChange={setTransferDate}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                          <span className="mb-2">
                            {validationErrors.date && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.date.map(
                                    (error, index) => (
                                      <li key={index}>{error}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </span>
                        </Box>
                      )}
                      <Grid className="mt-5">
                        <Button
                          type="button"
                          onClick={handleClose}
                          variant="contained"
                          style={{
                            backgroundColor: "gray",
                            marginRight: "10px",
                          }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          type="submit"
                          disabled={sloading}
                          variant="contained"
                          color="success"
                        >
                          {sloading ? "SAVING..." : "SAVE"}
                        </Button>
                      </Grid>
                    </Box>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSet;
