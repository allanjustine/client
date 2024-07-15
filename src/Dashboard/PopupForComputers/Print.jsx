import React, { useEffect } from "react";
import "../../styles/Printing.css";
import header from "../../img/headerForPrinting.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const PrintInformation = () => {
  
  useEffect(() => {
    const handleAfterPrint = () => {
      window.location.href = "/computers";
    };

    window.onload = () => {
      window.print();
      window.onafterprint = handleAfterPrint;
    };

    return () => {
      window.onload = null;
      window.onafterprint = null;
    };
  }, []);

  return (
    <div>
      <img src={header} alt="Header" />
      <p className="text-xl">
        User ID: <b></b>
      </p>
      <p className="text-xl">
        Branch Code: <b></b>
      </p>
      <p className="text-xl">
        Name of User: <b></b>
      </p>
      <p className="text-xl">
        Position: <b></b>
      </p>
      <p className="text-xl">
        Computer ID: <b></b>
      </p>
      <p className="text-xl">
        Total Format: <b></b>
      </p>
      <br />
      <p className="text-xl font-semibold">SPECIFICATIONS</p> <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                UNIT CODE
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                CATEGORY
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                DESCRIPTION
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                SUPPLIER
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                DATE OF PURCHASE
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                SERIAL NUMBER
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                STATUS
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                RECENT USER
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <p className="text-xl font-semibold">INSTALLED APPLICATIONS</p>
      <br />
      <p className="text-xl font-semibold">REMARKS</p>
    </div>
  );
};

export default PrintInformation;
