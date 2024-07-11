import React from "react";
import SideBar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Dashboard from "./Db2";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import Header from "./Header";
import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

function DashBoard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
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
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 row-span-1">
              <p className="pt-10 ml-10 text-2xl font-normal">Dashboard</p>
              <div className="mt-2 ml-10">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    color="text.primary"
                  >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                  </Typography>
                </Breadcrumbs>
              </div>
            </div>
            <div className="justify-end col-span-1 row-span-1 text-end">
              {user && user.data && (
                <p className="pt-10 text-lg font-normal mr-14">
                  Welcome,{" "}
                  <Link to="/profile">
                    <b>
                      {user.data.firstName} {user.data.lastName}
                    </b>
                  </Link>
                </p>
              )}
            </div>
          </div>
          <br /> <br />
          <div className="ml-10 mr-10">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
