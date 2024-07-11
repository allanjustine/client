import React, { useEffect, useState } from "react";
import profile from "../img/profile.png";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import ChartBoxUser from "../data/ChartBoxUser";
import ChartBoxUnit from "../data/ChartBoxUnit";
import ChartBoxComputer from "../data/ChartBoxComputer";
import ChartBoxRemark from "../data/ChartBoxRemark";
import axios from "../api/axios";

function TopBox() {
  const [userFormatted, setUserFormatted] = useState([]);

  const getRandomEmail = () => {
    const domains = ["example.com", "mail.com", "test.com"];
    const randomName = Math.random().toString(36).substring(2, 11);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomName}@${randomDomain}`;
  };

  useEffect(() => {
    const fetchUserFormatted = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const computersData = response.data.usersFormatted.map((user) => ({
          username: user.computer_user.name,
          img: profile,
          email: getRandomEmail(),
          many: user.formatted_status,
        }));

        setUserFormatted(computersData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchUserFormatted();
  }, []);

  //many = how many computers been formatted in his/her ownership

  const dataUsers = userFormatted;
  return (
    <div className="topBox ">
      <h1 className="mb-5 text-xl font-bold">
        Top Users with Most Formatted Computers
      </h1>
      <div className="list">
        {dataUsers.length === 0 ? (
          <p className="text-center">No users have formatted computers yet.</p>
        ) : (
          dataUsers.map((user) => (
            <div
              className="flex items-center justify-between mb-8 listItem"
              key={user.id}
            >
              <div className="flex gap-5 user">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src={user.img}
                  alt="User"
                />
                <div className="flex flex-col gap-1 userText">
                  <span className="text-sm font-medium username">
                    {user.username}
                  </span>
                  <span className="text-xs email">{user.email}</span>
                </div>
              </div>
              <span
                className="font-medium bcode"
                style={{ color: user.many < 5 ? "limegreen" : "tomato" }}
              >
                {user.many}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ChartBox(props) {
  return (
    <div className="flex h-full chartBox">
      <div
        className="flex flex-col justify-between boxInfo"
        style={{ flex: "3" }}
      >
        <div className="flex items-center gap-2 title">
          <p className="text-white">{props.icon}</p>
          <span className="text-base font-medium text-white">
            {props.title}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white">{props.number}</h1>
        <Link to="#" style={{ color: "white" }}></Link>
      </div>
      <div
        className="flex flex-col justify-between chartInfo"
        style={{ flex: "2" }}
      >
        <div className="w-full h-full chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 60 }}
              />
              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col text-right text">
          <span
            className="text-xl font-bold percentage"
            style={{ color: props.color }}
          >
            {props.percentage}%
          </span>
          <span className="text-sm text-white duration">This Month</span>
        </div>
      </div>
    </div>
  );
}

function BarChartBox(props) {
  return (
    <div className="w-full h-full barChartBox">
      <h1 className="mb-3 text-xl">{props.title}</h1>
      <div className="chart">
        {props.hasData ? (
          <ResponsiveContainer width="99%" height={120}>
            <BarChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "5px" }}
                labelStyle={{ display: "none" }}
                cursor={{ fill: "none" }}
              />
              <Bar dataKey={props.dataKey} fill={props.color} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center">No data found</p>
        )}
      </div>
    </div>
  );
}

function PieChartBox() {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPieData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchPieData();
  }, []);

  const data = [
    { name: "Using", value: pieData.totalUsed, color: "#008bf2" },
    { name: "Vacant", value: pieData.totalVacant, color: "#00c49f" },
    { name: "Defective", value: pieData.totalDefective, color: "#ffbb28" },
    { name: "Transfer", value: pieData.totalUsedTransfer, color: "#ff8042" },
  ];
  return (
    <div className="flex flex-col justify-between h-full pieChartBox">
      <h1 className="text-2xl font-bold">Status</h1>
      <div className="flex items-center justify-center w-full h-full chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
            />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between gap-3 text-sm options">
        {data.map((item) => (
          <div
            className="flex flex-col items-center gap-3 option"
            key={item.name}
          >
            <div className="flex items-center gap-3 title">
              <div
                className="w-3 h-3 rounded-full dot"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BigChartBox() {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedData = response.data.analytics.map((analytic) => ({
          name: analytic.name,
          set: analytic.computers_count,
          unit: analytic.units_count,
        }));
        setAnalyticsData(formattedData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []);
  return (
    <div className="flex flex-col justify-between w-full h-full bigChartBox">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="w-full chart h-80">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={analyticsData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="set"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="unit"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Dashboard() {
  const [weeklyRemarks, setWeeklyRemarks] = useState([]);
  const [hasData, setHasData] = useState([]);

  useEffect(() => {
    const fetchWeeklyRemarks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const remarksData = response.data.weeklyRemarks.map((day) => ({
          name: day.name.substring(0, 3),
          Remarks: day.Remarks,
        }));

        setWeeklyRemarks(remarksData);
        const data = remarksData.some((day) => day.Remarks > 0);
        setHasData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchWeeklyRemarks();
  }, []);
  return (
    <div
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      style={{ gridAutoRows: "minmax(180px, auto)" }}
    >
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-3 rounded-xl">
        <TopBox />
      </div>
      <div className="col-span-1 p-5 bg-green-500 border border-gray-100 rounded-xl">
        <ChartBoxUser />
      </div>
      <div className="col-span-1 p-5 border border-gray-100 rounded-xl bg-rose-500">
        <ChartBoxUnit />
      </div>
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-4 rounded-xl">
        <PieChartBox />
      </div>
      <div className="col-span-1 p-5 border border-gray-100 rounded-xl bg-amber-500">
        <ChartBoxComputer />
      </div>
      <div className="col-span-1 p-5 bg-blue-500 border border-gray-100 rounded-xl">
        <ChartBoxRemark />
      </div>
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-2 lg:col-span-2 md:row-span-2 rounded-xl">
        <BigChartBox />
      </div>
      <div className="col-span-1 p-5 bg-blue-100 border border-gray-100 rounded-xl">
        <BarChartBox
          title="Weekly Remarks"
          dataKey="Remarks"
          color="#ff8042"
          chartData={weeklyRemarks}
          hasData={hasData}
        />
      </div>
    </div>
  );
}

export default Dashboard;
