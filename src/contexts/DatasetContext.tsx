
import React, { createContext, useContext, useState, ReactNode } from "react";
import { DatasetMetrics, DatasetContextProps } from "@/types/dataset";
import { useDatasetProcessor } from "@/hooks/useDatasetProcessor";

const initialMetrics: DatasetMetrics = {
  userStats: {
    total: 0,
    active: 0,
    new: 0,
    unapproved: 0
  },
  dataLeakageStats: {
    potentialIncidents: 0,
    criticalRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    mitigated: 0
  },
  networkData: [],
  anomalyDistribution: [],
  alerts: [],
  lastUpdated: null,
  csvData: null,
  threatTypes: {},
  unauthorizedUsers: [],
  phishingAttempts: [],
  dataSensitivity: {},
  report: null
};

const DatasetContext = createContext<DatasetContextProps | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);
  const { processCSVFile: processCSV, generateReport: genReport } = useDatasetProcessor();

  // Process CSV file and generate metrics using our adaptive detector
  const processCSVFile = async (file: File): Promise<DatasetMetrics> => {
    try {
      const result = await processCSV(file);
      return result;
    } catch (error) {
      console.error("DatasetContext - Error processing CSV:", error);
      throw error; // Re-throw to let component handle it
    }
  };

  // Generate report from processed data
  const generateReport = (): string | null => {
    try {
      const report = genReport(metrics);
      
      // Update metrics with report
      if (report && metrics) {
        setMetrics(prev => prev ? { ...prev, report } : null);
      }
      
      return report;
    } catch (error) {
      console.error("DatasetContext - Error generating report:", error);
      return null;
    }
  };

  return (
    <DatasetContext.Provider value={{ 
      isDatasetUploaded, 
      setIsDatasetUploaded, 
      metrics, 
      setMetrics,
      processCSVFile,
      generateReport
    }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}
