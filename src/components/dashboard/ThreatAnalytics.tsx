
import React from "react";
import NetworkTrafficChart from "./NetworkTrafficChart";
import ThreatDistributionChart from "./ThreatDistributionChart";
import ThreatMetrics from "./ThreatMetrics";

interface NetworkData {
  name: string;
  Traffic: number;
  Alerts: number;
}

interface AnomalyData {
  name: string;
  value: number;
}

interface ThreatAnalyticsProps {
  networkData: NetworkData[];
  anomalyDistribution: AnomalyData[];
  isDatasetUploaded: boolean;
  potentialIncidents: number;
  mitigated: number;
}

const ThreatAnalytics = ({ 
  networkData, 
  anomalyDistribution, 
  isDatasetUploaded, 
  potentialIncidents, 
  mitigated 
}: ThreatAnalyticsProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <h3 className="font-medium mb-6">Threat Analytics</h3>

      <div className="flex flex-col gap-8">
        <NetworkTrafficChart networkData={networkData} />
        <ThreatDistributionChart anomalyDistribution={anomalyDistribution} />
        <ThreatMetrics 
          isDatasetUploaded={isDatasetUploaded} 
          potentialIncidents={potentialIncidents} 
          mitigated={mitigated} 
        />
      </div>
    </div>
  );
};

export default ThreatAnalytics;
