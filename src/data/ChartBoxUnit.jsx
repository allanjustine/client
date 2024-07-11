import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxUser = () => {
  const [chartDataUnit, setChartDataUnit] = useState([]);
  const [weeklyUnits, setWeeklyUnits] = useState([]);
  const [unitPercent, setUnitPercent] = useState([]);

  useEffect(() => {
    const fetchChartDataUnit = async () => {
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
        setChartDataUnit(response.data);
        const unitsData = response.data.weeklyUnits.map((day) => ({
          name: day.name.substring(0, 3),
          Units: day.units,
        }));

        setWeeklyUnits(unitsData);
        setUnitPercent(response.data.unitsPercent);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartDataUnit();
  }, []);

  const chartBox1 = {
    color: "#000080",
    icon: <FontAwesomeIcon icon={faDesktop} />,
    title: "Total Units",
    number: chartDataUnit.totalUnits,
    dataKey: "Units",
    percentage: unitPercent,
    chartData: weeklyUnits,
  };

  return <ChartBox {...{ ...chartBox1 }} />;
};

export default ChartBoxUser;
