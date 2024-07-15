import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellSlash, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import defaultImg from "../img/profile.png";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

function Header({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notifCount, setNotifCount] = useState(null);
  const [refreshNotification, setRefreshNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noNotification, setNoNotification] = useState(null);
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const openProfileMenu = Boolean(profileAnchorEl);
  const openNotificationMenu = Boolean(notificationAnchorEl);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

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
        setProfileImg(response.data.data.profile_picture);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get("/api/unread-notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setNotification(response.data.unread);
          setNotifCount(response.data.notificationCount);
          setNoNotification(response.data.empty);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 1000);

    return () => clearInterval(intervalId);
  }, [refreshNotification]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Logout",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        await axios.get("/api/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        window.location = "/login";
      } catch (error) {
        console.error("Error logging out:", error);
        Swal.fire("Error!", "Failed to log out. Please try again.", "error");
      }
    }
  };

  const handleMarkAsRead = async (event, notifId) => {
    event.preventDefault();
    setRefreshNotification(true);
    setLoading(true);
    setLoadingNotificationId(notifId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        `api/marked-as-read/${notifId}`,
        {},
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
      }
      console.log("Marking as read:", response.data);
    } catch (error) {
      console.error("Error in marking as read:", error);
      if (error.response && error.response.data) {
        console.log("Backend error response:", error.response.data);
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
      setRefreshNotification(false);
      setLoading(false);
      setLoadingNotificationId(false);
    }
  };

  const handleMarkAllAsRead = async (event) => {
    event.preventDefault();
    setRefreshNotification(true);
    setLoading(true);
    setLoadingAll(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "api/marked-all-as-read",
        {},
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
      }
      console.log("Marking as read:", response.data);
    } catch (error) {
      console.error("Error in marking as read:", error);
      if (error.response && error.response.data) {
        console.log("Backend error response:", error.response.data);
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
      setRefreshNotification(false);
      setLoading(false);
      setLoadingAll(false);
    }
  };

  const imageUrl = profileImg
    ? `http://localhost:8000/${profileImg}`
    : defaultImg;

  function timeAgo(date) {
    return formatDistanceToNowStrict(parseISO(date), { addSuffix: true });
  }

  return (
    <div>
      <div className="flex items-center justify-between w-full h-20 pr-10 bg-blue-800">
        <button onClick={toggleSidebar} className="ml-4 text-white md:hidden">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="flex-grow text-center">
          <p className="text-sm font-bold text-white md:text-4xl">
            COMPUTER MONITORING SYSTEM
          </p>
        </div>

        {user && user.data && (
          <div>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotificationClick}
                size="small"
                sx={{ color: "white", position: "relative" }}
                aria-controls={
                  openNotificationMenu ? "notification-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={openNotificationMenu ? "true" : undefined}
              >
                <NotificationsIcon
                  sx={{
                    color: "white",
                    ...(notification
                      ? {
                          animation: "wiggle 1s infinite",
                          "@keyframes wiggle": {
                            "0%": { transform: "rotate(0deg)" },
                            "10%": { transform: "rotate(-15deg)" },
                            "20%": { transform: "rotate(15deg)" },
                            "30%": { transform: "rotate(-15deg)" },
                            "40%": { transform: "rotate(15deg)" },
                            "50%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(0deg)" },
                          },
                        }
                      : {}),
                  }}
                />
                {notification ? (
                  <span className="absolute top-0 right-0 flex w-4 h-4">
                    <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="relative inline-flex items-center text-[10px] justify-center w-4 h-4 font-bold text-white bg-red-500 rounded-full">
                      {notifCount}
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Account Settings">
              <IconButton
                onClick={handleProfileClick}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={openProfileMenu ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openProfileMenu ? "true" : undefined}
              >
                <Avatar alt={user.data.firstName} src={imageUrl} />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <Menu
          anchorEl={profileAnchorEl}
          id="profile-menu"
          open={openProfileMenu}
          onClose={handleProfileClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {user && user.data && (
            <Link to="/profile">
              <MenuItem>
                <Avatar src={imageUrl} />{" "}
                <b>
                  {user.data.firstName} {user.data.lastName}
                </b>
              </MenuItem>
            </Link>
          )}
          <Divider
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px" }}
          >
            Other Links
          </Divider>
          <Link
            to="http://122.53.61.91:4000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <ConfirmationNumberIcon fontSize="small" />
              </ListItemIcon>
              Ticketing System
            </MenuItem>
          </Link>
          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon>
              <InsertDriveFileIcon fontSize="small" />
            </ListItemIcon>
            Request Form
          </MenuItem>
          <Link
            to="http://122.53.61.91:3000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItem>
              <ListItemIcon>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              SMCT Chat
            </MenuItem>
          </Link>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          id="notification-menu"
          open={openNotificationMenu}
          onClose={handleNotificationClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: "350px",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
            <Typography variant="h6">
              <span className="text-lg">
                <strong>Notifications</strong>
              </span>
            </Typography>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {dataLoading ? (
              <div>
                <div class="shadow rounded-md p-4 max-w-sm w-full mx-auto">
                  <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 bg-slate-700 rounded"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="shadow rounded-md p-4 max-w-sm w-full mx-auto">
                  <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 bg-slate-700 rounded"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : noNotification ? (
              <Typography
                variant="body2"
                className="relative"
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  paddingY: 7,
                }}
              >
                <p className="text-xl">
                  <FontAwesomeIcon icon={faBellSlash} />
                </p>
                <p className="mt-3 text-xl">No notifications</p>
              </Typography>
            ) : (
              notification?.map((notif, index) => (
                <div
                  key={index}
                  className={
                    loadingAll
                      ? "bg-slate-300"
                      : loading && loadingNotificationId === notif.id
                      ? "bg-slate-300"
                      : ""
                  }
                >
                  <MenuItem
                    disabled={
                      loading && loadingAll
                        ? loadingAll
                        : loadingNotificationId === notif.id
                    }
                    onClick={(event) => {
                      if (!loading || loadingNotificationId === notif.id) {
                        handleMarkAsRead(event, notif.id);
                      }
                    }}
                    className={
                      loadingAll
                        ? "relative animate-bounce"
                        : loading && loadingNotificationId === notif.id
                        ? "relative animate-bounce"
                        : "relative"
                    }
                  >
                    <div className="absolute top-0 right-0 w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></div>
                    <Avatar
                      src={
                        notif.user.profile_picture
                          ? `http://localhost:8000/${notif.user.profile_picture}`
                          : defaultImg
                      }
                      sx={{ mr: 2 }}
                    />
                    <div>
                      <Typography variant="body2">
                        <b>
                          {notif.user.firstName} {notif.user.lastName}
                        </b>
                      </Typography>
                      <Typography variant="body2"> {notif.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeAgo(notif.created_at)}
                      </Typography>
                    </div>
                  </MenuItem>
                  <hr />
                </div>
              ))
            )}
          </div>
          {notification ? (
            <MenuItem
              onClick={notification ? handleMarkAllAsRead : undefined}
              sx={{ justifyContent: "center" }}
            >
              <Typography variant="body2" color="primary">
                Mark all as read
              </Typography>
            </MenuItem>
          ) : (
            ""
          )}
        </Menu>
      </div>
    </div>
  );
}

export default Header;
