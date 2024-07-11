import React, { useState } from "react";
import SideBar from "./Sidebar";
import { Link } from "react-router-dom";
//import { QrReader } from 'react-qr-reader';
import Codes from "./Codes";
import Header from "./Header";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

function QrC() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <p className="pt-10 ml-10 text-2xl font-normal">Scan QR Codes</p>
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
                <QrCodeScannerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Scan QR
              </Typography>
            </Breadcrumbs>
          </div>
          <br /> <br />
          <div className="flex items-center justify-center text-center">
            <Codes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrC;
