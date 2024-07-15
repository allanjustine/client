import React, { useState, useEffect } from "react";
import smct from "./../../img/smct.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";

function Specs({
  isOpen,
  onClose,
  specsData,
  specsPopupData,
  setSpecsPopupData,
}) {
  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");
  useEffect(() => {
    // Flatten units from each computer into rows
    if (Array.isArray(specsPopupData.computers)) {
      const specsData = specsPopupData.computers.flatMap((computer) =>
        computer.units.map((unit) => ({
          ...unit,
          computerName: computer.name,
        }))
      );
      setRows(specsData);
      const id = specsPopupData.computers.map((comp) => comp.id);
      setId(id);
    }
  }, [specsPopupData]);
  if (!isOpen) {
    return null; // Render nothing if isOpen is false
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40 z-50">
      <div
        className="bg-white shadow-md rounded-2xl"
        style={{ maxWidth: "100vh", maxHeight: "100vh" }}
      >
        <div className="relative flex p-5 bg-blue-500 rounded-tr-2xl rounded-tl-2xl">
          <div className="flex-none">
            <img
              src={smct}
              alt="SMCT Logo"
              className="block h-24 m-0 w-60"
            ></img>
          </div>
          <div className="text-3xl font-medium text-white flex-2 ml-28 mt-7">
            Computer ID: {id.length === 1 ? id : "NaN"}
          </div>
          <CloseIcon
            onClick={onClose}
            className="absolute text-white cursor-pointer right-5 top-5"
          />
        </div>
        <div className="max-h-screen mt-6 mb-4 ml-6 mr-6 overflow-y-scroll text-justify">
          <h2 className="mb-4 text-xl font-semibold">Specifications:</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
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
                {rows.map((unit, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{unit.unit_code}</TableCell>
                    <TableCell align="center">
                      {unit.category.category_name}
                    </TableCell>
                    <TableCell align="center">{unit.description}</TableCell>
                    <TableCell align="center">
                      {unit.supplier.supplier_name}
                    </TableCell>
                    <TableCell align="center">
                      {format(new Date(unit.date_of_purchase), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="center">{unit.serial_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Specs;
