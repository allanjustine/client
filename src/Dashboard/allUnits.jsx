import React, { useState, useEffect } from "react";
import SideBar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import {
  AppBar,
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import Header from "./Header";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AllUnits() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setFilteredUnits(units);
  }, [units]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = units.filter(
      (unit) =>
        unit.unit_code.toLowerCase().includes(searchValue) ||
        unit.category.category_name.toLowerCase().includes(searchValue) ||
        unit.status.toLowerCase().includes(searchValue)
    );

    setFilteredUnits(filteredData);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchUnits = async () => {
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
        const unit = response.data.data;

        setUnits(unit);
        setLoading(false);
      } catch (error) {
        console.error("Error all units:", error);
        if (error.response.status === 404) {
          setError(true);
        }
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleClickOpen = (unit) => {
    setSelectedUnit(unit);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUnit(null);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, units.length - page * rowsPerPage);

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
          <p className="pt-10 ml-10 text-2xl font-normal">All Units</p>
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
                color="text.primary"
              >
                <DevicesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                All Units
              </Typography>
            </Breadcrumbs>
          </div>
          <br /> <br />
          <div className="h-full ml-10 mr-10">
            {/* Search bar */}
            <TextField
              label="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              sx={{ width: 300 }}
              size="small"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TableContainer className="mt-1 bg-white rounded-lg shadow-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-blue-400">
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={"white"}
                      >
                        UNIT CODE
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={"white"}
                      >
                        CATEGORY
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={"white"}
                      >
                        STATUS
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={"white"}
                      >
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4}>
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
                    filteredUnits
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((unit, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{unit.unit_code}</TableCell>
                          <TableCell align="center">
                            {unit.category.category_name}
                          </TableCell>
                          <TableCell align="center">{unit.status}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => handleClickOpen(unit)}>
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                  {loading
                    ? ""
                    : emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={4}>
                            {filteredUnits.length === 0 ? (
                              !searchTerm ? (
                                <p className="text-xl text-center">
                                  No units to found.
                                </p>
                              ) : (
                                <p className="text-xl text-center">
                                  No "{searchTerm}" result found.
                                </p>
                              )
                            ) : (
                              ""
                            )}{" "}
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                count={units.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={
                  <Typography variant="subtitle" fontWeight={600}>
                    Entries Per Page:
                  </Typography>
                }
              />
            </TableContainer>
          </div>
        </div>
      </div>
      {selectedUnit && (
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {selectedUnit.unit_code} - {selectedUnit.category.category_name}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent dividers>
            <div style={{ overflowY: "auto" }}>
              <TableContainer
                className="w-full bg-white rounded-lg shadow-md"
                style={{
                  maxWidth: "1000px",
                  margin: "0 auto",
                  textAlign: "center",
                  marginTop: "50px",
                  marginBottom: "50px",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow className="bg-red-400">
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={"white"}
                        >
                          STATUS
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={"white"}
                        >
                          RECENT USER
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={"white"}
                        >
                          DATE OF TRANSFER
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedUnit && selectedUnit.transfer_units.length > 0 ? (
                      selectedUnit.transfer_units.map((transfer, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {transfer.status}
                          </TableCell>
                          <TableCell align="center">
                            {transfer.computer_user.name}
                          </TableCell>
                          <TableCell align="center">
                            {format(new Date(transfer.date), "MMMM dd, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={3}>
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AllUnits;
