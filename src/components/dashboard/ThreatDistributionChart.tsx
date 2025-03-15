
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
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      <h4 className="text-sm font-medium mb-5">Threat Distribution by Type</h4>
      <div className="h-[350px] w-full"> {/* Increased height for better spacing */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <Pie
              data={anomalyDistribution}
              cx="40%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => {
                // Make sure the name is visible in the label
                return `${name} (${(percent * 100).toFixed(0)}%)`;
              }}
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
              wrapperStyle={{ 
                paddingLeft: "40px", 
                right: 0,
                width: "40%"
              }}
              formatter={(value, entry, index) => {
                // Find the correct data entry by name instead of relying on index
                const dataEntry = anomalyDistribution.find(item => item.name === value);
                
                if (!dataEntry) return null;
                
                // Match color to the correct data entry
                const colorIndex = anomalyDistribution.findIndex(item => item.name === value);
                const color = COLORS[colorIndex % COLORS.length];
                
                return (
                  <span style={{ 
                    color: '#333333', 
                    fontSize: '12px', 
                    paddingLeft: '8px',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {`${value}: ${dataEntry.value}`}
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
