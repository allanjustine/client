import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxComputer = () => {
  const [chartDataComputer, setChartDataComputer] = useState([]);
  const [weeklyComputers, setWeeklyComputers] = useState([]);
  const [computerPercent, setComputerPercent] = useState([]);

  useEffect(() => {
    const fetchChartDataComputer = async () => {
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
        setChartDataComputer(response.data);
        const computersData = response.data.weeklyComputers.map((day) => ({
          name: day.name.substring(0, 3),
          Computers: day.Computers,
        }));

        setWeeklyComputers(computersData);
        setComputerPercent(response.data.computersPercent);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartDataComputer();
  }, []);

  const chartBoxComputer = {
    color: "brown",
    icon: <FontAwesomeIcon icon={faComputer} />,
    title: "Total Computers",
    number: chartDataComputer.totalComputers,
    dataKey: "Computers",
    percentage: computerPercent,
    chartData: weeklyComputers,
  };

  return <ChartBox {...chartBoxComputer} />;
};

export default ChartBoxComputer;
