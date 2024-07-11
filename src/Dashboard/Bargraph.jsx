import React from 'react';
import { BarChart, Bar, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BarGraph() {
    const data = [
        { name: 'Week 1', 'Monitored Computers': 65 },
        { name: 'Week 2', 'Monitored Computers': 59 },
        { name: 'Week 3', 'Monitored Computers': 80 },
        { name: 'Week 4', 'Monitored Computers': 81 },
    ];

    return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={150}
                    height={40}
                    data={data}
                >
                    <Tooltip
                        isAnimationActive={false}
                        separator={": "}
                        cursor={false}
                        labelFormatter={(value) => data[value].name}
                    />
                    <Legend/>
                    <Bar
                        dataKey="Monitored Computers"
                        fill="rgba(54, 162, 235, 0.9)"
                        stroke="rgba(54, 162, 235, 1)"
                        strokeWidth={1}
                    />
                </BarChart>
            </ResponsiveContainer>
    );
}

export default BarGraph;