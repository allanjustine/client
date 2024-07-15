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
  Checkbox,
  TextField,
  Autocomplete,
} from "@mui/material";
import { TablePagination } from "@material-ui/core";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import { format } from "date-fns";

function Add({ isOpen, onClose, onSubmit, refresh }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [vacantUnit, setVacantUnit] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [computerUser, setComputerUser] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [computer, setComputer] = useState({
    computer_user: "",
  });
  const [vloading, setvLoading] = useState(true);
  const [verror, setvError] = useState(false);

  useEffect(() => {
    setFilteredData(vacantUnit);
  }, [vacantUnit]);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/units", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVacantUnit(response.data.vacant || []);
        setvLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response.status === 404) {
          setvError(true);
        }
        setvLoading(false);
      }
    };

    fetchUnit();
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
        console.error("Error fetching data:", error);
      }
    };

    fetchComputerUser();
  }, [computerUser]);

  const ComputerUser =
    computerUser.data && computerUser.data.length > 0
      ? computerUser.data.map((cu) => ({
          id: cu.id,
          name: cu.name,
        }))
      : [];

  const handleCheckboxClick = (unitId) => {
    if (checkedRows.includes(unitId)) {
      setCheckedRows(checkedRows.filter((id) => id !== unitId));
    } else {
      setCheckedRows([...checkedRows, unitId]);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value);
  };

  const filterData = (value) => {
    if (!value.trim()) {
      setFilteredData(vacantUnit);
    } else {
      const filtered = vacantUnit.filter(
        (item) =>
          item.category.category_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.unit_code.toLowerCase().includes(value.toLowerCase()) ||
          item.supplier.supplier_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.serial_number.toLowerCase().includes(value.toLowerCase()) ||
          item.date_of_purchase.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  if (!isOpen) {
    return null;
  }

  const handleSubmitAssignedUser = async (event) => {
    event.preventDefault();
    onSubmit(true);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "api/add-computer",
        {
          checkedRows: checkedRows,
          computer_user: computer.computer_user,
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
        setCheckedRows("");
        setComputer("");
        setComputerUser("");
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
      onSubmit(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        className="bg-white shadow-md rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl"
        style={{ minWidth: "1100px", maxWidth: "100vh", maxHeight: "100vh" }}
      >
        <div className="text-justify">
          <form onSubmit={handleSubmitAssignedUser}>
            <div className="flex-none">
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
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          UNIT CODE
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          DATE OF PURCHASE
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          CATEGORY
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          DESCRIPTION
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          SUPPLIER
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          SERIAL NO.
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: 700 }}
                        >
                          STATUS
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          label="Search Unit"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          variant="outlined"
                          fullWidth
                          sx={{ width: 100 }}
                          size="small"
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vloading ? (
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
                      filteredData
                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                        .map((un, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{un.unit_code}</TableCell>
                            <TableCell align="center">
                              {format(
                                new Date(un.date_of_purchase),
                                "yyyy-MM-dd"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {un.category.category_name}
                            </TableCell>
                            <TableCell align="center">
                              {un.description}
                            </TableCell>
                            <TableCell align="center">
                              {un.supplier.supplier_name}
                            </TableCell>
                            <TableCell align="center">
                              {un.serial_number}
                            </TableCell>
                            <TableCell align="center">{un.status}</TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={checkedRows.includes(un.id)}
                                onChange={() => handleCheckboxClick(un.id)}
                                sx={
                                  validationErrors.checkedRows
                                    ? {
                                        "& .MuiSvgIcon-root": {
                                          border: "2px solid",
                                          borderColor: "red",
                                          borderRadius: "4px",
                                        },
                                        "&.Mui-checked .MuiSvgIcon-root": {
                                          borderColor: "secondary.main",
                                        },
                                      }
                                    : {}
                                }
                              />
                              <br />
                              {validationErrors.checkedRows ? (
                                <p className="text-xs text-red-500">
                                  Please check one or more first.
                                </p>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}

                    {vloading
                      ? ""
                      : emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={8}>
                              {filteredData.length === 0 ? (
                                !searchTerm ? (
                                  <p className="text-xl text-center">
                                    No vacant units found.
                                  </p>
                                ) : (
                                  <p className="text-xl text-center">
                                    No "{searchTerm}" result found.
                                  </p>
                                )
                              ) : (
                                ""
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(event, newPage) =>
                    handleChangePage(event, newPage)
                  }
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage={
                    <Typography variant="subtitle" fontWeight={600}>
                      Entries Per Page:{" "}
                    </Typography>
                  }
                />
              </TableContainer>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex-none">
                <Autocomplete
                  freeSolo
                  id="user"
                  disableClearable
                  options={ComputerUser}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  readOnly={ComputerUser.length === 0}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label={
                        ComputerUser.length === 0
                          ? "No user to select"
                          : "Assign User"
                      }
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                      variant="outlined"
                      style={{
                        marginLeft: "20px",
                        marginTop: "20px",
                        marginBottom: "20px",
                        marginRight: "400px",
                        width: "300px",
                      }}
                    />
                  )}
                  value={
                    ComputerUser.find(
                      (option) => option.id === computer.computer_user
                    ) || {}
                  }
                  onChange={(event, newValue) => {
                    setComputer({ ...computer, computer_user: newValue.id });
                  }}
                />
              </div>
              <div className="items-center justify-center flex-1 text-center">
                <button
                  className="w-24 h-8 text-sm font-semibold bg-gray-200 rounded-full"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                {filteredData.length === 0 ? (
                  <button
                    disabled
                    type="submit"
                    className="w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-300 rounded-full cursor-not-allowed"
                  >
                    {loading ? "ADDING..." : "ADD"}
                  </button>
                ) : (
                  <button
                    disabled={loading || checkedRows.length === 0}
                    type="submit"
                    className={
                      loading || checkedRows.length === 0
                        ? "w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-300 rounded-full cursor-not-allowed"
                        : "w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-600 rounded-full"
                    }
                  >
                    {loading ? "ADDING..." : "ADD"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;
