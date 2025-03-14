
import React from "react";

interface ThreatMetricsProps {
  isDatasetUploaded: boolean;
  potentialIncidents: number;
  mitigated: number;
}

const ThreatMetrics = ({ isDatasetUploaded, potentialIncidents, mitigated }: ThreatMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Threats Detected</h4>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">
            {isDatasetUploaded 
              ? potentialIncidents + mitigated 
              : 37}
          </p>
          <p className="text-xs text-red-500">+12% vs prev week</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Threats Mitigated</h4>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{mitigated || 35}</p>
          <p className="text-xs text-green-500">
            {isDatasetUploaded
              ? `${Math.round((mitigated / (potentialIncidents + mitigated)) * 100)}% success rate`
              : '94.5% success rate'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreatMetrics;
