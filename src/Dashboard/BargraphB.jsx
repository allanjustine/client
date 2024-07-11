import React from 'react';
import { BarChart, Bar, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './../styles/Tailwind.css';

function BarGraphB() {
    const data = [
        { month: 'January', 'Monitored Computers': 65 },
        { month: 'February', 'Monitored Computers': 59 },
        { month: 'March', 'Monitored Computers': 80 },
        { month: 'April', 'Monitored Computers': 81 },
        { month: 'May', 'Monitored Computers': 80 },
        { month: 'June', 'Monitored Computers': 30 },
        { month: 'July', 'Monitored Computers': 65 },
        { month: 'August', 'Monitored Computers': 73 },
        { month: 'September', 'Monitored Computers': 38 },
        { month: 'October', 'Monitored Computers': 27 },
        { month: 'November', 'Monitored Computers': 83 },
        { month: 'December', 'Monitored Computers': 90 },
    ];

    return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    width={150}
                    height={40}
                >
                    <Tooltip 
                    isAnimationActive={false}
                    separator={": "}
                    cursor={false}
                    labelFormatter={(value) => data[value].month}
                    />
                    <Legend />
                    <Bar
                        dataKey="Monitored Computers"
                        fill="#ff4d4d"
                        stroke="#ff3333"
                        strokeWidth={1}
                    />
                </BarChart>
            </ResponsiveContainer>
    );
}

export default BarGraphB;