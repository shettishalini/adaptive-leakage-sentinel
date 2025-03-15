
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AnomalyData {
  name: string;
  value: number;
}

interface ThreatDistributionChartProps {
  anomalyDistribution: AnomalyData[];
}

const ThreatDistributionChart = ({ anomalyDistribution }: ThreatDistributionChartProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h4 className="text-sm font-medium mb-5">Threat Distribution by Type</h4>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={anomalyDistribution}
              cx="30%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {anomalyDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ paddingLeft: "60px" }}
              formatter={(value, entry, index) => {
                if (index === undefined || index >= anomalyDistribution.length) return null;
                return (
                  <span style={{ color: '#333333', fontSize: '12px', paddingLeft: '8px' }}>
                    {`${value}: ${anomalyDistribution[index].value}`}
                  </span>
                );
              }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value} incidents`, `${name}`]} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatDistributionChart;
