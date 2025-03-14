
import { useState, useEffect } from "react";
import { useDataset } from "@/contexts/DatasetContext";
import DashboardHeader from "./DashboardHeader";
import StatCards from "./StatCards";
import ProtectionStatus from "./ProtectionStatus";
import ThreatAlerts from "./ThreatAlerts";
import ThreatAnalytics from "./ThreatAnalytics";
import usePdfReportGenerator from "./PdfReportGenerator";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDatasetUploaded, metrics, generateReport } = useDataset();
  
  // Default data for when no dataset is uploaded
  const defaultNetworkData = [
    { name: "Mon", Traffic: 120, Alerts: 20 },
    { name: "Tue", Traffic: 180, Alerts: 10 },
    { name: "Wed", Traffic: 200, Alerts: 15 },
    { name: "Thu", Traffic: 150, Alerts: 8 },
    { name: "Fri", Traffic: 220, Alerts: 25 },
    { name: "Sat", Traffic: 90, Alerts: 5 },
    { name: "Sun", Traffic: 75, Alerts: 2 },
  ];

  const defaultAnomalyDistribution = [
    { name: "Network", value: 45 },
    { name: "File Access", value: 30 },
    { name: "User Behavior", value: 15 },
    { name: "Database", value: 10 },
    { name: "Data Exposure", value: 25 }
  ];

  const defaultUserStats = {
    total: 1245,
    active: 987,
    new: 34,
    unapproved: 18
  };

  const defaultDataLeakageStats = {
    potentialIncidents: 12,
    criticalRisk: 3,
    mediumRisk: 6,
    lowRisk: 3,
    mitigated: 8
  };

  const { handleDownloadReport } = usePdfReportGenerator({ 
    metrics, 
    generateReport, 
    isDatasetUploaded 
  });

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("dashboard");
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const networkData = metrics?.networkData || defaultNetworkData;
  const anomalyDistribution = metrics?.anomalyDistribution || defaultAnomalyDistribution;
  const userStats = metrics?.userStats || defaultUserStats;
  const dataLeakageStats = metrics?.dataLeakageStats || defaultDataLeakageStats;
  const lastUpdated = metrics?.lastUpdated;

  return (
    <section
      id="dashboard"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-50 opacity-50 transform -skew-x-12" />

      <div className="container mx-auto px-6 relative z-10">
        <DashboardHeader 
          handleDownloadReport={handleDownloadReport}
          isDatasetUploaded={isDatasetUploaded}
          lastUpdated={lastUpdated}
        />

        <div
          className={`glass rounded-2xl border border-gray-100 shadow-xl p-6 md:p-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-20"
          }`}
        >
          <StatCards 
            userStats={userStats} 
            dataLeakageStats={dataLeakageStats} 
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ProtectionStatus />
              <ThreatAlerts 
                alerts={metrics?.alerts} 
                handleDownloadReport={handleDownloadReport} 
              />
            </div>

            <div className="flex-1">
              <ThreatAnalytics 
                networkData={networkData}
                anomalyDistribution={anomalyDistribution}
                isDatasetUploaded={isDatasetUploaded}
                potentialIncidents={dataLeakageStats.potentialIncidents}
                mitigated={dataLeakageStats.mitigated}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
