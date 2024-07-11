import React, { useState, useRef, useEffect } from "react";
import SideBar from "../Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faRightFromBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { data } from "../../data/vacantUnitsData";
import { TableContainer } from "@material-ui/core";
import Select from "react-select";
import Header from "../../Dashboard/Header";
import HomeIcon from "@mui/icons-material/Home";
import PhonelinkSetupIcon from "@mui/icons-material/PhonelinkSetup";
import SettingsIcon from "@mui/icons-material/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "visible",
    marginTop: theme.spacing(3),
  },
  //table: {
  //minWidth: 650,
  //},
  container: {
    overflowX: "visible",
  },
  table: {
    borderRadius: 10,
  },
}));

const CustomTableB = (refresh) => {
  const classes = useStyles();
  const [unit, setUnit] = useState({ vacantDefective: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(false);

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
        setUnit(response.data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error fetching units data:", error);
        if (error.response.status === 404) {
          setError(true);
        }
        setLoading(false);
      }
    };

    fetchUnit();
  }, [refresh]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div
      className={`${classes.root} border border-transparent rounded-xl shadow-lg max-h-max w-full mt-3`}
    >
      <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className="bg-red-200">
              <TableCell align="center" className="rounded-tl-xl">
                <p className="font-semibold text-base mt-1.5">UNIT CODE</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-base mt-1.5">
                  DATE OF PURCHASE
                </p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-base mt-1.5">CATEGORY</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-base mt-1.5">DESCRIPTION</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-base mt-1.5">SUPPLIER</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-base mt-1.5">SERIAL NO.</p>
              </TableCell>
              <TableCell align="center" className="rounded-tr-xl">
                <p className="font-semibold text-base mt-1.5">STATUS</p>
              </TableCell>
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
            ) : unit.vacantDefective && unit.vacantDefective.length > 0 ? (
              unit.vacantDefective
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{data.unit_code}</TableCell>
                    <TableCell align="center">
                      {format(new Date(data.date_of_purchase), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="center">
                      {data.category ? data.category.category_name : "N/A"}
                    </TableCell>
                    <TableCell align="center">{data.description}</TableCell>
                    <TableCell align="center">
                      {data.supplier ? data.supplier.supplier_name : "N/A"}
                    </TableCell>
                    <TableCell align="center">{data.serial_number}</TableCell>
                    <TableCell align="center">{data.status}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No vacant/defective units found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 15, 20, 25]}
          component="div"
          count={unit.vacantDefective.length}
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
  );
};

//Searchable Dropdown
const SearchableDropdown = ({
  options,
  placeholder,
  onSelect,
  searchTerm,
  setSearchTerm,
}) => {
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
    const term = event.target.value || "";
    setSearchTerm(term);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    const term = searchTerm || "";
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <input
        type="text"
        className="w-full pl-2 bg-gray-200 border border-transparent rounded-xl h-9"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && (
        <ul className="absolute z-20 w-full mt-1 text-justify bg-white border border-gray-300 rounded-xl top-full">
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
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const CustomTableA = ({ rows, setRows, onSubmit }) => {
  const classes = useStyles();
  const [category, setCategory] = useState({ data: [] });
  const [supplier, setSupplier] = useState({ data: [] });
  const [uloading, setuLoading] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState("");
  const [categorySearchTerms, setCategorySearchTerms] = useState([""]);
  const [supplierSearchTerms, setSupplierSearchTerms] = useState([""]);
  const options = [
    { value: "Vacant", label: "Vacant" },
    { value: "Used", label: "Used" },
    { value: "Defective", label: "Defective" },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCategory();
  }, [category]);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/suppliers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchSupplier();
  }, [supplier]);

  // This is a sample data for Category
  const Category =
    category.data && category.data.length > 0
      ? category.data.map((cat) => ({
          label: cat.category_name,
          value: cat.id,
        }))
      : [];

  // This is a sample data for Supplier
  const Supplier =
    supplier.data && supplier.data.length > 0
      ? supplier.data.map((sup) => ({
          label: sup.supplier_name,
          value: sup.id,
        }))
      : [];

  const addRow = () => {
    setRows([
      ...rows,
      {
        date_of_purchase: "",
        category: "",
        description: "",
        supplier: "",
        serial_number: "",
        status: "",
      },
    ]);
    setCategorySearchTerms([...categorySearchTerms, ""]);
    setSupplierSearchTerms([...supplierSearchTerms, ""]);
  };

  const handleChangeA = (date, index) => {
    const newRows = [...rows];
    newRows[index]["date_of_purchase"] = date;
    setRows(newRows);
  };

  const handleSelectChange = (selectedOption, index) => {
    const newRows = [...rows];
    newRows[index]["status"] = selectedOption.value;
    setRows(newRows);
  };

  const handleChange = (index, key, newValue) => {
    const newRows = [...rows];
    newRows[index][key] = newValue;
    setRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    const newCategorySearchTerms = categorySearchTerms.filter(
      (_, i) => i !== index
    );
    setCategorySearchTerms(newCategorySearchTerms);
    const newSupplierSearchTerms = supplierSearchTerms.filter(
      (_, i) => i !== index
    );
    setSupplierSearchTerms(newSupplierSearchTerms);
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    setuLoading(true);
    onSubmit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post("/api/add-unit", rows, {
        headers: {
          Authorization: `Bearer ${token}`,
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
        setRows([
          {
            date_of_purchase: "",
            category: "",
            description: "",
            supplier: "",
            serial_number: "",
            status: "",
          },
        ]);
        setCategorySearchTerms([""]);
        setSupplierSearchTerms([""]);
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
      setuLoading(false);
      onSubmit(false);
    }
  };

  return (
    <div
      className={`${classes.root} border border-transparent rounded-xl shadow-lg max-h-max w-full mt-3`}
    >
      <form onSubmit={handleAddUnit}>
        <TableContainer className={classes.container}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className="bg-blue-200">
                <TableCell align="center" className="rounded-tl-xl">
                  <p className="font-semibold text-base mt-1.5">
                    DATE OF PURCHASE
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-base mt-1.5">CATEGORY</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-base mt-1.5">DESCRIPTION</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-base mt-1.5">SUPPLIER</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-base mt-1.5">SERIAL NO.</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-base mt-1.5">STATUS</p>
                </TableCell>
                <TableCell align="center" className="rounded-tr-xl">
                  <FontAwesomeIcon icon={faTrash} className="opacity-0" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <DatePicker
                      selected={
                        row.date_of_purchase
                          ? new Date(row.date_of_purchase)
                          : null
                      }
                      onChange={(date) => handleChangeA(date, index)}
                      placeholderText=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.date_of_purchase`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.date_of_purchase`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.date_of_purchase`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <SearchableDropdown
                      options={Category}
                      value={row.category}
                      searchTerm={categorySearchTerms[index]}
                      setSearchTerm={(term) => {
                        const newSearchTerms = [...categorySearchTerms];
                        newSearchTerms[index] = term;
                        setCategorySearchTerms(newSearchTerms);
                      }}
                      placeholder=""
                      onSelect={(option) => {
                        handleChange(index, "category", option.value);
                      }}
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.category`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.category`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      placeholder=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.description`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.description`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.description`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <SearchableDropdown
                      options={Supplier}
                      value={row.supplier}
                      searchTerm={supplierSearchTerms[index]}
                      setSearchTerm={(term) => {
                        const newSearchTerms = [...supplierSearchTerms];
                        newSearchTerms[index] = term;
                        setSupplierSearchTerms(newSearchTerms);
                      }}
                      placeholder=""
                      onSelect={(option) => {
                        handleChange(index, "supplier", option.value);
                      }}
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.supplier`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.supplier`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <input
                      type="text"
                      value={row.serial_number}
                      onChange={(e) =>
                        handleChange(index, "serial_number", e.target.value)
                      }
                      placeholder=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.serial_number`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.serial_number`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.serial_number`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      options={options}
                      value={
                        row.status
                          ? options.find(
                              (option) => option.value === row.status
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, index)
                      }
                      placeholder={row.status ? "" : "Select status"}
                      className={
                        validationErrors && validationErrors[`${index}.status`]
                          ? "border border-red-500"
                          : ""
                      }
                    />

                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.status`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.status`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => deleteRow(index)}
                        className="text-base font-semibold text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <button
          type="button"
          onClick={addRow}
          className="mt-2 mb-2 ml-5 text-base font-semibold text-green-600"
        >
          <FontAwesomeIcon icon={faCirclePlus}></FontAwesomeIcon> ADD FIELD
        </button>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={uloading}
            className="w-32 mt-4 mb-5 text-base font-semibold text-white duration-700 bg-green-600 border border-transparent hover:bg-green-700 rounded-3xl h-9"
          >
            {uloading ? "ADDING..." : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
};

function Unit() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [rows, setRows] = useState([
    {
      date_of_purchase: "",
      category: "",
      description: "",
      supplier: "",
      serial_number: "",
      status: "",
    },
  ]);
  const [sloading, setsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [refresh, setRefresh] = useState(false);

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        "/api/add-category",
        {
          category_name: category,
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
        setError("");
        setCategory("");
        setValidationErrors("");
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
      setsLoading(false);
    }
  };

  const handleSupplier = (e) => {
    setSupplier(e.target.value);
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        "/api/add-supplier",
        {
          supplier_name: supplier,
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
        setError("");
        setSupplier("");
        setValidationErrors("");
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
          <p className="pt-10 ml-10 text-2xl font-normal">Setup Unit</p>
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
                <PhonelinkSetupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Setup Unit
              </Typography>
            </Breadcrumbs>
          </div>
          <br /> <br />
          <div className="flex items-center justify-center ml-10 mr-10">
            <div className="w-1/2 mr-5 border border-transparent shadow-lg rounded-xl max-h-max">
              <div className="flex items-center justify-center text-center">
                <div className="w-full h-10 bg-yellow-200 rounded-tl-xl rounded-tr-xl">
                  <p className="font-semibold text-base mt-1.5">ADD CATEGORY</p>
                </div>
              </div>
              <div className="flex justify-center pt-5 pb-4 pl-5 pr-5">
                <input
                  type="text"
                  name="category_name"
                  value={category}
                  onChange={handleCategory}
                  placeholder="Input category..."
                  className={
                    validationErrors.category_name
                      ? "bg-gray-200 border border-red-500 rounded-xl w-3/4 h-9 pl-5"
                      : "bg-gray-200 border border-transparent rounded-xl w-3/4 h-9 pl-5"
                  }
                />
              </div>
              <span className="text-sm text-center">
                {validationErrors.category_name && (
                  <div className="text-red-500">
                    {validationErrors.category_name.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </div>
                )}
              </span>
              <div className="flex justify-center">
                <button
                  onClick={handleAddCategory}
                  disabled={sloading}
                  className="w-32 mb-5 text-base font-semibold text-white duration-700 bg-green-600 border border-transparent hover:bg-green-700 rounded-3xl h-9"
                >
                  {sloading ? "ADDING..." : "ADD"}
                </button>
              </div>
            </div>
            <div className="w-1/2 border border-transparent shadow-lg rounded-xl max-h-max">
              <div className="flex items-center justify-center text-center">
                <div className="w-full h-10 bg-yellow-200 rounded-tl-xl rounded-tr-xl">
                  <p className="font-semibold text-base mt-1.5">ADD SUPPLIER</p>
                </div>
              </div>
              <div className="flex justify-center pt-5 pb-4 pl-5 pr-5">
                <input
                  type="text"
                  name="supplier_name"
                  value={supplier}
                  onChange={handleSupplier}
                  placeholder="Input supplier..."
                  className={
                    validationErrors.supplier_name
                      ? "bg-gray-200 border border-red-500 rounded-xl w-3/4 h-9 pl-5"
                      : "bg-gray-200 border border-transparent rounded-xl w-3/4 h-9 pl-5"
                  }
                />
              </div>

              <span className="text-sm text-center">
                {validationErrors.supplier_name && (
                  <div className="text-red-500">
                    {validationErrors.supplier_name.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </div>
                )}
              </span>
              <div className="flex justify-center">
                <button
                  onClick={handleAddSupplier}
                  disabled={loading}
                  className="w-32 mb-5 text-base font-semibold text-white duration-700 bg-green-600 border border-transparent hover:bg-green-700 rounded-3xl h-9"
                >
                  {loading ? "ADDING..." : "ADD"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center ml-10 mr-10">
            <CustomTableA rows={rows} setRows={setRows} onSubmit={setRefresh} />
          </div>
          <div className="flex items-center justify-center ml-10 mr-10">
            <CustomTableB rows={rows} refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unit;
