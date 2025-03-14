
import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface NetworkData {
  name: string;
  Traffic: number;
  Alerts: number;
}

interface NetworkTrafficChartProps {
  networkData: NetworkData[];
}

const NetworkTrafficChart = ({ networkData }: NetworkTrafficChartProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Network Traffic & Alerts</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={networkData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Traffic" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Alerts" stroke="#ff5555" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkTrafficChart;
