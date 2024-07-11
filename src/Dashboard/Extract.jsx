import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import {
  Chip,
  Card,
  Grid,
  Container,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  Autocomplete,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Loading from "../context/Loading";

const Extract = () => {
  const { id } = useParams();
  const [computer, setComputer] = useState(null);
  const [cLoading, setcLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [remarksContent, setRemarksContent] = useState("");
  const [applicationContent, setApplicationContent] = useState([]);
  const [date, setDate] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComputerData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get(`/api/computers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          setComputer(response.data.computer);
        } else {
          console.error("Fetch error:", response.data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setcLoading(false);
      }
    };

    fetchComputerData();
  }, [computer]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        `api/computers/install-application/add-remarks/${id}`,
        {
          application_content: applicationContent,
          remark_content: remarksContent,
          date: date,
          format: remark,
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
        setApplicationContent([]);
        setDate(null);
        setRemark("");
        setRemarksContent("");
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
    }

    // Example of sending data to backend:
    /*
    try {
      const response = await axios.post('/api/computers/update', {
        id,
        remark,
        remarks,
        selectedDate,
        application,
        ...(application === 'Others' && {otherApplication}),
      });
      if (response.data.status) {
        console.log('Data updated successfully.');
      } else {
        console.error('Update error:', response.data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
    */
  };

  const handleApplications = (e, newValue) => {
    e.preventDefault();
    setApplicationContent(newValue);
  };
  if (cLoading) {
    return (
      <div>
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
          <div class="w-16 h-16 border-8 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="absolute mt-24 text-xl text-center">
            <strong>Loading...</strong>
          </p>
        </div>
      </div>
    );
  } else {
    if (computer) {
      return (
        <Container>
          <Card className="mt-20 mb-20">
            <div className="flex justify-center mt-4">
              <Link
                to="/dashboard"
                className="inline-block px-4 py-2 text-blue-500 transition duration-300 ease-in-out border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
              >
                Back to dashboard
              </Link>
            </div>
            <CardContent>
              <Typography variant="h5">Computer Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    ID: <b>{computer.id}</b>
                  </Typography>
                  <Typography variant="body1">
                    Name: <b>{computer.computer_user.name}</b>
                  </Typography>
                  <Typography variant="body1">
                    Position:{" "}
                    <b>{computer.computer_user.position.position_name}</b>
                  </Typography>
                  <Typography variant="body1">
                    Branch Code:&nbsp;
                    <b>{computer.computer_user.branch_code.branch_name}</b>
                  </Typography>
                  <Typography variant="body1">
                    Total Format:&nbsp;
                    {computer.formatted_status === 0 ? (
                      "No formatting has been applied yet."
                    ) : (
                      <span
                        class={
                          computer.formatted_status >= 10
                            ? "bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full"
                            : "bg-yellow-500 text-white text-sm font-semibold px-4 py-1 rounded-full"
                        }
                      >
                        {computer.formatted_status}
                      </span>
                    )}
                  </Typography>
                  <TableContainer className="mt-4 border border-gray-200 rounded-lg">
                    <Table>
                      <TableHead className="bg-blue-200">
                        <TableRow>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              UNIT CODE
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
                              DATE OF PURCHASE
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              SERIAL NUMBER
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {computer.units.map((unit, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              {unit.unit_code}
                            </TableCell>
                            <TableCell align="center">
                              {unit.category.category_name}
                            </TableCell>
                            <TableCell align="center">
                              {unit.description}
                            </TableCell>
                            <TableCell align="center">
                              {unit.supplier.supplier_name}
                            </TableCell>
                            <TableCell align="center">
                              {format(
                                new Date(unit.date_of_purchase),
                                "yyyy-MM-dd"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {unit.serial_number}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justify="center"
                  style={{ marginTop: "10px" }}
                >
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" align="center">
                      Installed Applications
                    </Typography>
                    <div className="text-center"
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      <List>
                        {computer.installed_applications
                          .slice(
                            0,
                            showAll ? computer.installed_applications.length : 5
                          )
                          .map((item, index) => (
                            <ListItem key={index}>
                              <ListItemText className="text-center"
                                primary={item.application_content}
                              />
                            </ListItem>
                          ))}
                        {computer.installed_applications.length === 0 ? (
                          <p className="text-center">
                            No Installed Applications yet.
                          </p>
                        ) : (
                          ""
                        )}
                      </List>
                      {computer.installed_applications.length > 5 && (
                        <Button onClick={toggleShowAll}>
                          {showAll ? "Show less" : "Show more"}
                        </Button>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" align="center">
                      Remarks
                    </Typography>
                    <div className="text-center"
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      <List>
                        {computer.remarks
                          .slice(0, showAll ? computer.remarks.length : 5)
                          .map((item, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={
                                  <div className="p-2 border rounded-lg">
                                    <div>
                                      {format(
                                        new Date(item.date),
                                        "MMMM dd, yyyy"
                                      )}
                                    </div>
                                    {item.remark_content
                                      .split("\n")
                                      .map((line, lineIndex) => (
                                        <div key={lineIndex}>{line}</div>
                                      ))}
                                  </div>
                                }
                              />
                            </ListItem>
                          ))}
                        {computer.remarks.length === 0 ? (
                          <p className="text-center">No Remarks yet.</p>
                        ) : (
                          ""
                        )}
                      </List>
                      {computer.remarks.length > 5 && (
                        <Button onClick={toggleShowAll}>
                          {showAll ? "Show less" : "Show more"}
                        </Button>
                      )}
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <form onSubmit={handleSubmit}>
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
                      <p className="text-red-500">
                        {validationErrors.application_content.map(
                          (error, index) => (
                            <span key={index}>{error}</span>
                          )
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                    <TextField
                      label="Is it Formatted?"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      select
                      fullWidth
                      margin="normal"
                    >
                      <MenuItem value="No">No</MenuItem>
                      <MenuItem value="Yes">Formatted</MenuItem>
                    </TextField>
                    {validationErrors.format ? (
                      <p className="text-red-500">
                        {validationErrors.format.map((error, index) => (
                          <span key={index}>{error}</span>
                        ))}
                      </p>
                    ) : (
                      ""
                    )}
                    <TextareaAutosize
                      aria-multiline
                      value={remarksContent}
                      onChange={(e) => setRemarksContent(e.target.value)}
                      placeholder="Enter Remarks..."
                      style={{
                        border: "1px solid #bdbdbd",
                        borderRadius: "5px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                        width: "100%",
                        maxWidth: "1120px",
                        height: "35px",
                        marginTop: "10px",
                        overflow: "hidden",
                        resize: "none",
                      }}
                    />
                    {validationErrors.remark_content ? (
                      <p className="text-red-500">
                        {validationErrors.remark_content.map((error, index) => (
                          <span key={index}>{error}</span>
                        ))}
                      </p>
                    ) : (
                      ""
                    )}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateField"]}>
                        <DateField
                          fullWidth
                          label="Date"
                          value={date}
                          onChange={(newDate) => setDate(newDate)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    {validationErrors.date ? (
                      <p className="text-red-500">
                        {validationErrors.date.map((error, index) => (
                          <span key={index}>{error}</span>
                        ))}
                      </p>
                    ) : (
                      ""
                    )}
                    <br />
                    <Button
                      disabled={loading}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {loading ? "Adding..." : "Add"}
                    </Button>
                  </form>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-screen p-4 bg-gray-100">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <p className="mb-4 text-2xl text-red-700">
              This computer does not exist.
            </p>
            <Link
              className="inline-block px-4 py-2 text-blue-500 transition duration-300 ease-in-out border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
              to="/qr"
            >
              Back to scan
            </Link>
          </div>
        </div>
      );
    }
  }
};

export default Extract;