
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
  csvData: string[][] | null;
  threatTypes: Record<string, number>;
  unauthorizedUsers: string[];
  phishingAttempts: string[];
  dataSensitivity: Record<string, string>;
  report: string | null;
  mitigationTasks: string[]; 
  modelTrained?: boolean;
  accuracy?: number;
  precision?: number;
  recall?: number;
}

export interface DatasetContextProps {
  isDatasetUploaded: boolean;
  setIsDatasetUploaded: (value: boolean) => void;
  metrics: DatasetMetrics | null;
  setMetrics: (metrics: DatasetMetrics) => void;
  processCSVFile: (file: File) => Promise<DatasetMetrics>;
  generateReport: () => string | null;
}
