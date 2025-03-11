
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DatasetMetrics {
  userStats: {
    total: number;
    active: number;
    new: number;
    unapproved: number;
  };
  dataLeakageStats: {
    potentialIncidents: number;
    criticalRisk: number;
    mediumRisk: number;
    lowRisk: number;
    mitigated: number;
  };
  networkData: Array<{
    name: string;
    Traffic: number;
    Alerts: number;
  }>;
  anomalyDistribution: Array<{
    name: string;
    value: number;
  }>;
  alerts: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
    severity: "low" | "medium" | "high";
  }>;
  lastUpdated: Date | null;
}

interface DatasetContextProps {
  isDatasetUploaded: boolean;
  setIsDatasetUploaded: (value: boolean) => void;
  metrics: DatasetMetrics | null;
  setMetrics: (metrics: DatasetMetrics) => void;
}

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
  lastUpdated: null
};

const DatasetContext = createContext<DatasetContextProps | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);

  return (
    <DatasetContext.Provider value={{ isDatasetUploaded, setIsDatasetUploaded, metrics, setMetrics }}>
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
